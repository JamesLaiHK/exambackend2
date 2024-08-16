const mongoose = require("mongoose");

//create and/or connect to a db
mongoose.connect('mongodb+srv://dbo:csis3380@jameshkyvr.25rlrgk.mongodb.net/books', { useNewUrlParser: true, useUnifiedTopology: true })

import Book from '../models/booklist.model'


// creating
const book1 = new Book({

    title: "Book title",
    author: "Book Author",
    pages: 300,
    fiction: true});

Book.insertMany([book1]);


