const bookModel = require('../model/book.js')
const moment = require('moment-timezone')

module.exports = {
    booksTaken: async (req, res, next) => {
        try {
            const booksTaken = await bookModel.findAll({
                where: {
                    isReturned: false
                }
            })

            for(let book of booksTaken) {
                let delay = moment(book.expectedReturnDate).diff(new Date(), 'hours')
                let fine = delay * 10
                await bookModel.update({fine},{where: {id: book.id}})
            }

            return res.status(200).json(booksTaken)
        }
        catch(error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    },

    booksReturned:  async (req, res, next) => {
        try {
            const booksReturned = await bookModel.findAll({
                where: {
                    isReturned: true
                }
            })

            return res.status(200).json(booksReturned)
        }
        catch(error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    },

    rentBook : async (req, res, next) => {
        try {

            const { title } = req.body

            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }

            const takenDate = moment().toDate()
            const book = await bookModel.create({
                title,
                takenDate,
                expectedReturnDate: moment(takenDate).add(1, 'hour').toDate()
            })

            return res.status(200).json(book)
        }
        catch(error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    },

    returnBook : async (req, res, next) => {
        try {

            const { id } = req.body

            if (!id) {
                return res.status(400).json({ error: 'id is required' });
            }

            const book = await bookModel.findByPk(id)
            if(!book.isFinePaid && book.fine > 0) {
                return res.status(401).json({ error: 'Fine not paid. Please pay before returning' });
            }

            await bookModel.update(
                {
                    isReturned: true,
                    actualReturnDate: moment().toDate()
                },
                {
                    where: {
                        id
                    }
                }
            );

            return res.status(200).json(book)
        }
        catch(error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    },

    payFine : async (req, res, next) => {
        try {

            const { id, fine } = req.body

            if (!id) {
                return res.status(400).json({ error: 'id is required' });
            }

            if (!fine || fine <= 0) {
                return res.status(400).json({ error: 'fine is required' });
            }

            const book = await bookModel.findByPk(id)

            if(book.fine !== fine) {
                return res.status(400).json({ error: 'fine amount is not matching' });
            }

            await bookModel.update(
                {
                    isFinePaid: true
                },
                {
                    where: {
                        id
                    }
                }
            );

            return res.status(200).json(book)
        }
        catch(error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }

}
