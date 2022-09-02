import { NODE_ENV } from 'config'

import { setApiFeedback } from 'helpers'

import { history } from 'utils'

const production = NODE_ENV === 'production'

export const handleApiError = (error: ApiError) => {
   if (!production) {
      console.log(error)
   }

   if (error.response?.data) {
      const responseStatus = error.response.status

      const { errorHeader, errorMessage } = error.response.data

      if (responseStatus === 401) {
         history.push('/login')
      }

      if (errorHeader && errorMessage) {
         return setApiFeedback(errorHeader, errorMessage, 'Okey')
      }

      return setApiFeedback(
         'Server connectivity',
         `Couldn't connect to the server`,
         'Refresh the application',
         () => production && window.location.reload()
      )
   }

   if (error.request) {
      return setApiFeedback(
         'Server connectivity',
         'The server cannot temporarily process your request',
         'Refresh the application',
         () => production && window.location.reload()
      )
   }

   setApiFeedback(
      'Server connectivity',
      'An unexpected problem has occurred in the application',
      'Refresh the application',
      () => production && window.location.reload()
   )
}
