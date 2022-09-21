import { useEffect } from 'react'
import type { InferType } from 'yup'

import { API } from '@online-library/tools'

import { useQueryParams } from 'hooks'

import { setApiFeedback } from 'helpers'

import { apiAxios, history } from 'utils'

const { request, validation, header, errors } = API['/api/user/auth/account'].patch

export const useAccountActivation = () => {
   const { activationToken } = useQueryParams() as InferType<typeof validation>

   const activateAccount = async () => {
      try {
         const response = await apiAxios<typeof validation>(request, { activationToken })

         if (response) {
            setApiFeedback(header, errors[200], 'Okey', () => history.push('/login'))
         }
      } catch (error) {
         history.push('/login')
      }
   }

   useEffect(() => {
      if (activationToken) {
         activateAccount()
      }
   }, [activationToken])
}