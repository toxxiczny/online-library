import sequelize from 'sequelize'

const { DATABASE_HOST, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env

const connection = new sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'mysql',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    logging: true
})

import UserModel from './models/User'
import AuthenticationModel from './models/Authentication'
import BookModel from './models/Book'
import PaymentModel from './models/Payment'

const User = UserModel(connection)
const Authentication = AuthenticationModel(connection)
const Book = BookModel(connection)
const Payment = PaymentModel(connection)

User.hasOne(Authentication)
Authentication.belongsTo(User)

User.belongsToMany(Book, { through: 'register' })
Book.belongsToMany(User, { through: 'register' })

User.hasMany(Payment)
Payment.belongsTo(User)

const init = async () => {
    try {
        // await connection.sync({ force: true })
        // await connection.sync({ alter: true })
        await connection.sync()
        console.log('Successfully connected to the database.')
    } catch (error) {
        console.log({
            error,
            message: 'There was a problem connecting to the database'
        })
    }
}
init()

export { connection as Connection, User, Authentication, Book }