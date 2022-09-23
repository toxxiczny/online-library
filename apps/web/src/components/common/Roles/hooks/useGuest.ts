import { API } from '@online-library/tools'

import { defaultAxios, handleApiError, history, useSocket } from '@online-library/core'

import type { TokenCheckResponse } from 'types'

export const useGuest = () => {
   const { closeSocketConnection } = useSocket()

   const checkAuth = async () => {
      try {
         const { request } = API['/api/auth-check'].get

         const response = await defaultAxios<TokenCheckResponse>(request)

         if (response) {
            const { role } = response.data

            if (role === 'user') {
               return history.push('/store')
            }

            closeSocketConnection()
         }
      } catch (error) {
         handleApiError(error)
      }
   }

   return { checkAuth }
}
