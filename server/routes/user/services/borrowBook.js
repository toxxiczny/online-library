import { Connection, Book } from '@database'

import utils from '@utils'

export default {
    default: async (req, res, next) => {
        try {
            await Connection.transaction(async transaction => {
                const { id } = req.body
                const book = await Book.findByPk(id, {
                    transaction
                })
                if (
                    await req.user.hasBook(book, {
                        transaction
                    })
                ) {
                    throw new utils.ApiError(
                        'Borrowing a book',
                        'You have already borrowed this book',
                        409
                    )
                }
                await req.user.addBook(book, {
                    transaction
                })
                res.send({
                    success: true
                })
            })
        } catch (error) {
            next(error)
        }
    },
    validation: () => [utils.validator.validateInteger('id')]
}
