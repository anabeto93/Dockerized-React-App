const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'mysql_db',
    user: process.env.DB_USER || 'mysql_user',
    password: process.env.DB_PASSWORD || 'mysql_password',
    database: process.env.DB_DATABASE || 'books',
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// routes
app.get('/', (req, res) => {
    res.send('Hi there');
});

app.get('/books', (req, res) => {
    const select = "select * from book_reviews";

    db.query(select, (err, result) => {
        if (err) {
            return res.send({ success: false, error: [err.message] });
        }
        res.send({ success: true, data: result });
    });
});

app.post('/books', (req, res) => {
    const { name, review } = req.body;
    console.log({ msg: "CREATE_BOOK", name, review, body: req.body });
    if (!name) {
        res.status(422).send({ success: false, errors: { name: ['The name is required.'] }});
    }
    if (!review) {
        res.status(422).send({ success: false, errors: { review: ['The review is required.'] }});
    }
    const insert = "insert into book_reviews (name, review) values (?, ?)";
    db.query(insert, [name, review], (err, result) => {
        if (err) {
            return res.send({ success: false, error: [err.message] });
        }
        console.log({ msg: 'INSERTED REVIEW', result });
        res.send({ success: true, data: result });
    });
});

app.delete('/books/:bookId', (req, res) => {
    const { bookId } = req.params;

    const delQuery = "delete from book_reviews where id = ?";

    db.query(delQuery, bookId, (err, result) => {
        if (err) {
            return res.send({ success: false, error: [err.message] });
        }
        console.log({ msg: 'DELETED', result });

        res.send({ success: true, data: { id: bookId } });
    });
});

app.put('/books/:bookId', (req, res) => {
    const { review } = req.body;
    const id = req.params.bookId;
    const update = "update book_reviews set review = ? where id = ?";

    db.query(update, [review, id], (err, result) => {
        if (err) {
            return res.send({ success: false, error: [err.message] });
        }

        res.send({ success: true, data: result });
    });
});

// listen port
const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});