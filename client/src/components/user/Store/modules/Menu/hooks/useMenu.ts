import { useEffect, useState } from 'react'

import { API } from 'config'

import { useCart, useSocket, useTopOffset } from 'hooks'

import { axios, history } from 'utils'

export const useMenu = (_setShouldMenuExpand: ReactDispatch<boolean>) => {
   const { closeSocketConnection } = useSocket()

   const [shouldMenuExpand, setShouldMenuExpand] = useState(false)

   const { resetCart } = useCart()

   useEffect(() => _setShouldMenuExpand(shouldMenuExpand), [shouldMenuExpand])

   const logout = async () => {
      const response = await axios.get(API.logout)

      if (response) {
         window.FB.getLoginStatus((response: any) => {
            if (response.status === 'connected') {
               window.FB.logout(() => null)
            }
         })

         closeSocketConnection()

         resetCart()

         history.push('/login')
      }
   }

   const shouldMenuStick = useTopOffset() > 20

   return {
      shouldMenuExpand,
      shouldMenuStick,
      setShouldMenuExpand,
      logout,
   }
}
