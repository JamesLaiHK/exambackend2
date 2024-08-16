// importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// require('dotenv').config();

// setups
const app = express();
const port = process.env.PORT || 5000;
const URI = 'mongodb+srv://dbo:csis3380@jameshkyvr.25rlrgk.mongodb.net/300379980-james'

app.use(cors());
app.use(express.json());

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start your Express server once connected to MongoDB
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const bookSchema = new Schema({
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
    description: { type: String, required: true }
});

const Book = mongoose.model("Book", bookSchema);

const router = express.Router();

// Mount the router middleware at a specific path
app.use('/api/v1', router);

// app.get('/', (req, res) => {
router.route("/")
    .get((req, res) => {
        try {
            Book.find()
                .then((books) => {
                    if (books.length == 0) { res.json("no book found") } else { res.json(books) }
                })
        }
        catch (error) {
                res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")

    .get((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => { if (book == null) { res.json("no record found") } else { res.json(book) } })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/")
    .post((req, res) => {

        try {
            if (req.body.bookTitle == null || req.body.bookAuthor == null || req.body.description == null ) {
                res.json("Please submit all the fields for title, author, and description.")
            } else {
                const bookTitle = req.body.bookTitle;
                const bookAuthor = req.body.bookAuthor;
                const description = req.body.description;
                // create a new Book object 
                const newBook = new Book({
                    bookTitle,
                    bookAuthor,
                    description
                });

                // save the new object (newBook)
                newBook
                    .save()
                    .then(() => res.json("Book added!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")
    .put((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("no record found") }
                    else {
                        book.bookTitle = req.body.bookTitle;
                        book.bookAuthor = req.body.bookAuthor;
                        book.description = req.body.description;

                        book
                            .save()
                            .then(() => res.json("Book updated!"))
                            .catch((err) => res.status(400).json("Error: " + err));
                    }
                })
                .catch((err) => res.status(400).json("Error: " + err));
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")
    .delete((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("no record found") }
                    else {
                        Book.findByIdAndDelete(req.params.id)
                            .then(() => {
                                res.json("Book deleted.")
                            })
                    }
                })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }

    });
