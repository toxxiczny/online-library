import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'

import { _setSocket } from 'redux/reducers/socket'

import { useDispatch } from 'hooks'

export const useSocket = () => {
   const dispatch = useDispatch()

   const { socket } = useSelector(state => state.socket)

   const setSocket = (socket: Socket | null) => dispatch(_setSocket(socket))

   const closeSocketConnection = () => {
      if (socket) {
         socket.disconnect()
         setSocket(null)
      }
   }

   return {
      socket,
      setSocket,
      closeSocketConnection,
   }
}
