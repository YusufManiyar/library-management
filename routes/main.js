const express = require('express')
const mainController = require('../controller/main.js') 
const router = express.Router()

router.get('/bookstaken', mainController.booksTaken);

router.get('/booksreturned', mainController.booksReturned);

router.post('/rentbook', mainController.rentBook);

router.post('/payfine', mainController.payFine);

router.post('/returnbook', mainController.returnBook);

module.exports = router