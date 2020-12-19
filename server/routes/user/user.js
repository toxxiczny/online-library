import { Router } from 'express'

import middlewares from '../../middlewares'

import Services from './services'

const router = Router()

router.post(
    '/register',
    Services.register.validation(),
    middlewares.checkValidation,
    Services.register.default
)

router.post(
    '/authenticateEmail',
    Services.authenticateEmail.validation(),
    middlewares.checkValidation,
    Services.authenticateEmail.default
)

router.post(
    '/resendEmail',
    Services.resendEmail.validation(),
    middlewares.checkValidation,
    Services.resendEmail.default
)

router.post(
    '/login',
    Services.login.validation(),
    middlewares.checkValidation,
    Services.login.default
)

router.post(
    '/loginWithFacebook',
    middlewares.facebookAuthorization,
    Services.loginWithFacebook.validation(),
    middlewares.checkValidation,
    Services.loginWithFacebook.default
)

router.post(
    '/recoverPassword',
    Services.recoverPassword.validation(),
    middlewares.checkValidation,
    Services.recoverPassword.default
)

router.post(
    '/checkPasswordToken',
    Services.checkPasswordToken.validation(),
    middlewares.checkValidation,
    Services.checkPasswordToken.default
)

router.post(
    '/changePassword',
    Services.changePassword.validation(),
    middlewares.checkValidation,
    Services.changePassword.default
)

router.post(
    '/purchaseBooksWithStripe',
    middlewares.jwtAuthorization,
    Services.purchaseBooksWithStripe.validation(),
    middlewares.checkValidation,
    Services.purchaseBooksWithStripe.default
)

router.post(
    '/createPayPalPayment',
    middlewares.jwtAuthorization,
    Services.createPayPalPayment.validation(),
    middlewares.checkValidation,
    Services.createPayPalPayment.default
)

router.post(
    '/executePayPalPayment',
    middlewares.jwtAuthorization,
    Services.executePayPalPayment.validation(),
    middlewares.checkValidation,
    Services.executePayPalPayment.default
)

export default router