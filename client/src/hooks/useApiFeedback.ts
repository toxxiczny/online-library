import { useSelector } from 'react-redux'

export const useApiFeedback = () => {
   const { header, message, buttonText, callback } = useSelector(state => state.apiFeedback)

   const showApiFeedback = !!header && !!message && !!buttonText

   return {
      header,
      message,
      buttonText,
      callback,
      showApiFeedback,
   }
}
