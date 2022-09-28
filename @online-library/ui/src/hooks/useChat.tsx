import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
   API,
   FILE_EXTENSIONS,
   FILE_SIZES,
   MESSAGES_FETCH_LIMIT,
   MESSAGES_ORDER,
   MessageType,
   isWeb,
} from '@online-library/config'

import type { MessagesResponse, SendFileResponse } from '@online-library/core'
import {
   apiAxios,
   defaultAxios,
   detectMobileDevice,
   handleApiError,
   isChatInitialLoad,
   setApiFeedback,
   subscribePushNotifications,
   useChatDetails,
   usePrevious,
   useSocket,
} from '@online-library/core'

const { request, validation } = API['/api/user/chat/messages'].get

let uploadProgressInterval: ReturnType<typeof setInterval>

export const useChat = () => {
   const { socket } = useSocket()

   const [loading, setLoading] = useState(true)

   const { lastUnreadMessageIndex, setUnreadMessagesAmount } = useChatDetails()

   const messagesRef = useRef<HTMLDivElement>(null)
   const endOfMessages = useRef<HTMLDivElement>(null)
   const lastMessageBeforeFetch = useRef<HTMLDivElement>(null)

   const [currentUserId, setCurrentUserId] = useState<string>('')
   const [currentUserName, setCurrentUserName] = useState<string>('')

   const [messages, setMessages] = useState<MessageType[]>([])
   const [message, setMessage] = useState('')

   const [hasMoreMessages, setHasMoreMessages] = useState(true)

   const [triggerPersistingScroll, setTriggerPersistingScroll] = useState(0)
   const previousPersistScrollTrigger = usePrevious(triggerPersistingScroll)

   const [showFileInput, setShowFileInput] = useState(true)
   const [percentage, setPercentage] = useState(0)

   const handleInfiniteLoader = async (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement

      const isChatScrollOnTop = target.scrollTop <= 0

      const canLoadMessages = !loading && hasMoreMessages && isChatScrollOnTop

      if (canLoadMessages) {
         getMessages(MESSAGES_FETCH_LIMIT, messages.length)
         setTriggerPersistingScroll(Math.random())
      }
   }

   useEffect(() => {
      if (isWeb) {
         if (lastMessageBeforeFetch.current) {
            lastMessageBeforeFetch.current.scrollIntoView()
         }
      }
   }, [triggerPersistingScroll, previousPersistScrollTrigger])

   const getMessages = async (limit: number, offset: number) => {
      const response = await apiAxios<typeof validation, MessagesResponse>(request, {
         limit: limit.toString(),
         offset: offset.toString(),
      })

      if (response) {
         setLoading(false)

         const { messages: fetchedMessages, userId, userName } = response.data

         setHasMoreMessages(!!fetchedMessages.length)

         setCurrentUserId(userId)
         setCurrentUserName(userName)

         const chat = [...messages]

         fetchedMessages.map(message => {
            if (!chat.includes(message)) {
               chat.unshift(message)
            }
         })

         setMessages(chat.sort(MESSAGES_ORDER))

         if (lastUnreadMessageIndex) {
            if (chat.length >= lastUnreadMessageIndex) {
               setUnreadMessagesAmount(0)
            }
         }

         // NOTE: scrolls to the bottom on initial load
         if (isChatInitialLoad(chat)) {
            pushToLastMessage()
         }
      }
   }

   useEffect(() => {
      if (isWeb) {
         setTimeout(subscribePushNotifications, 2000)
      }
      getMessages(MESSAGES_FETCH_LIMIT, 0)
   }, [])

   useEffect(() => {
      const handleOnSendMessage = (message: MessageType) => {
         setMessages(messages => [...messages, message])

         // NOTE: VIDEO and IMAGE handle scrollToLastMessage with onLoad event
         if (message.type === 'MESSAGE' || message.type === 'FILE') {
            scrollToLastMessage(0)
         }

         socket?.emit('readMessages')
      }

      socket?.on('sendMessage', handleOnSendMessage)

      return () => {
         socket?.off('sendMessage', handleOnSendMessage)
      }
   }, [socket])

   const getUnreadMessages = async () => {
      if (lastUnreadMessageIndex) {
         const response = await apiAxios<typeof validation, MessagesResponse>(request, {
            limit: lastUnreadMessageIndex.toString(),
            offset: '0',
         })

         if (response) {
            const { messages } = response.data

            setMessages(messages)

            if (isWeb) {
               setTimeout(() => {
                  if (messagesRef.current) {
                     messagesRef.current.scrollTop = 1
                  }
               }, 0)
            }

            setUnreadMessagesAmount(0)
         }
      }
   }

   const scrollToLastMessage = (delay: number) => {
      setTimeout(() => {
         if (isWeb) {
            endOfMessages.current && endOfMessages.current.scrollIntoView({ behavior: 'smooth' })
         }
      }, delay)
   }

   const pushToLastMessage = () => {
      setTimeout(() => {
         if (isWeb) {
            const messages = messagesRef.current
            messages && (messages.scrollTop = messages.scrollHeight)
         }
      }, 0)
   }

   const sendMessage = async () => {
      if (message.trim()) {
         try {
            const lastMessage = messages[messages.length - 1]

            const id = lastMessage ? lastMessage.id + 1 : 0

            const _message: MessageType = {
               id,
               type: 'MESSAGE',
               content: message,
               userId: currentUserId,
               user: { name: currentUserName },
               createdAt: new Date().toString(),
            }

            setMessages(messages => [...messages, _message] as MessageType[])

            pushToLastMessage()

            setTimeout(() => setMessage(''), 0)

            const { request, validation } = API['/api/user/chat/messages'].post

            const response = await defaultAxios<typeof validation>(request, {
               content: message.trim(),
            })

            if (response) {
               socket?.emit('sendMessage', _message)
            }
         } catch (error) {
            const conversation = messages

            setMessages(conversation)

            handleApiError(error)
         }
      }
   }

   const sendFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { request, header, errors } = API['/api/user/chat/files'].post

      let percentage = 0

      const file = event.currentTarget.files?.[0]

      if (file) {
         const { images, videos, files } = FILE_EXTENSIONS

         const { maxImageSize, maxVideoSize, maxFileSize } = FILE_SIZES

         const { name, size } = file

         const isImage = images.test(name)
         const isVideo = videos.test(name)
         const isFile = files.test(name)

         const resetFileInput = () => {
            setShowFileInput(false)
            setTimeout(() => {
               setShowFileInput(true)
            }, 500)
         }

         const largeSizeError = () => {
            return setApiFeedback(header, errors[413])
         }

         if (!isImage && !isVideo && !isFile) {
            resetFileInput()
            return setApiFeedback(header, errors[415])
         }

         if (isImage) {
            if (size > maxImageSize) {
               resetFileInput()
               largeSizeError()
            }
         }

         if (isVideo) {
            if (size > maxVideoSize) {
               resetFileInput()
               largeSizeError()
            }
         }

         if (isFile) {
            if (size > maxFileSize) {
               resetFileInput()
               largeSizeError()
            }
         }

         const form = new FormData()

         form.append('file', file)

         try {
            uploadProgressInterval = setInterval(() => {
               if (percentage < 100) {
                  percentage++
                  setPercentage(percentage => percentage + 1)
               }
            }, 500)

            const response = await defaultAxios<FormData, SendFileResponse>(request, form)

            if (response) {
               setPercentage(100)

               clearInterval(uploadProgressInterval)

               setTimeout(() => {
                  setPercentage(0)
               }, 800)

               const { type, content } = response.data

               const lastMessage = messages[messages.length - 1]

               const id = lastMessage ? lastMessage.id + 1 : 0

               const message: MessageType = {
                  id,
                  type,
                  content,
                  filename: name,
                  userId: currentUserId,
                  user: { name: currentUserName },
                  createdAt: new Date().toString(),
               }

               setMessages([...messages, message] as MessageType[])

               scrollToLastMessage(0)

               resetFileInput()

               socket?.emit('sendMessage', message)
            }
         } catch (error) {
            handleApiError(error)

            resetFileInput()

            clearInterval(uploadProgressInterval)

            setPercentage(0)
         }
      }
   }

   const handleOnKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
         switch (true) {
            case detectMobileDevice() as boolean:
               return
            case !event.currentTarget.value.trim():
               event.preventDefault()
               break
            case !event.shiftKey:
               sendMessage()
               break
         }
      }
   }

   const isUploadingFile = percentage > 0

   return {
      messagesRef,
      endOfMessages,
      lastMessageBeforeFetch,
      currentUserId,
      messages,
      message,
      loading,
      isUploadingFile,
      percentage,
      showFileInput,
      setMessage,
      getMessages,
      getUnreadMessages,
      sendMessage,
      sendFile,
      scrollToLastMessage,
      handleOnKeyPress,
      handleInfiniteLoader,
   }
}