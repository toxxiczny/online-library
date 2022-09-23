import type { Role, messageTypes } from '@online-library/tools'

import type { MessageType } from '@online-library/core'

import type { Book } from 'gql'

export type TokenCheckResponse = {
   role: Role
}

export type MessagesResponse = {
   messages: MessageType[]
   userId: string
   userName: string
}
export type BooksResponse = {
   books: Book[]
}

export type ChatDetailsResponse = {
   lastUnreadMessageIndex: number
   unreadMessagesAmount: number
   userId: string
}

export type SendFileResponse = {
   type: typeof messageTypes[number]
   content: string
}

export type PaypalCheckoutResponse = {
   link: string
}
