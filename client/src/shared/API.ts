import swagger from './swagger.json'

export type Endpoint = keyof typeof swagger['paths']

export const getEndpointInfo = <E extends Endpoint>(endpoint: E) => ({
   url: endpoint,
   info: swagger['paths'][endpoint],
})

class _API {
   public AUTH = {
      authenticateEmail: {
         header: 'Email address authentication',
         ...getEndpointInfo('/api/user/auth/authenticateEmail'),
      },
      login: {
         header: '',
         ...getEndpointInfo('/api/user/auth/login'),
      },
      loginWithFacebook: {
         header: '',
         ...getEndpointInfo('/api/user/auth/loginWithFacebook'),
      },
      changePassword: {
         header: '',
         ...getEndpointInfo('/api/user/auth/changePassword'),
      },
      checkPasswordToken: {
         header: '',
         ...getEndpointInfo('/api/user/auth/checkPasswordToken'),
      },
      register: {
         header: '',
         ...getEndpointInfo('/api/user/auth/register'),
      },
      recoverPassword: {
         header: '',
         ...getEndpointInfo('/api/user/auth/recoverPassword'),
      },
      resendEmail: {
         header: '',
         ...getEndpointInfo('/api/user/auth/resendEmail'),
      },
   }
   public CHAT = {
      getMessagesInfo: {
         header: '',
         ...getEndpointInfo('/api/user/chat/getMessagesInfo'),
      },
      getMessages: {
         header: '',
         ...getEndpointInfo('/api/user/chat/getMessages'),
      },
      subscribePushNotifications: {
         header: '',
         ...getEndpointInfo('/api/user/chat/subscribePushNotifications'),
      },
      sendMessage: {
         header: '',
         ...getEndpointInfo('/api/user/chat/sendMessage'),
      },
      sendFile: {
         header: '',
         ...getEndpointInfo('/api/user/chat/sendFile'),
      },
   }
   public CART = {
      executePayPalPayment: {
         header: '',
         ...getEndpointInfo('/api/user/cart/executePayPalPayment'),
      },
      createPayPalPayment: {
         header: '',
         ...getEndpointInfo('/api/user/cart/createPayPalPayment'),
      },
      purchaseBooksWithStripe: {
         header: '',
         ...getEndpointInfo('/api/user/cart/purchaseBooksWithStripe'),
      },
   }
   public BOOKS = {
      getSuggestions: {
         header: '',
         ...getEndpointInfo('/api/user/books/getSuggestions'),
      },
   }
   public GLOBAL = {
      checkToken: {
         header: '',
         ...getEndpointInfo('/api/user/global/checkToken'),
      },
      logout: {
         header: '',
         ...getEndpointInfo('/api/user/global/logout'),
      },
   }
}

export const API = new _API()
