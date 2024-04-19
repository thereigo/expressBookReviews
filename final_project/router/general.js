const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const url = 'localhost:5000/';

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop

// Original solution
// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books,null,4));
// });

// Solution with promise callbacks
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then(() => {
    res.send(JSON.stringify(books, null, 4));

  })
  .catch((error) => {
    res.status(500).send({message: "Error fetching data"});
  });
});

// Get book details based on ISBN

// Original solution
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   books[isbn] ? res.status(200).json(books[isbn]) : res.status(404).json({message: "Book not found"});
// });

// Solution with promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  })
  .then((book) => {
    res.status(200).json(book);
  })
  .catch((error) => {
    res.status(404).json(error);
  });
});

  
// Get book details based on author

// Original solution
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   const booksArray = Object.values(books);
//   const authorBooks = booksArray.filter(book => book.author === author);
//   authorBooks.length > 0 ? res.status(200).json(authorBooks) : res.status(404).json({message: "Author not found"});
// });

// Solution with promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const booksArray = Object.values(books);
    const authorBooks = booksArray.filter(book => book.author === author);
    if (authorBooks.length > 0) {
      resolve(authorBooks);
    } else {
      reject({message: "Author not found"});
    }
  })
  .then((authorBooks) => {
    res.status(200).json(authorBooks);
  })
  .catch((error) => {
    res.status(404).json(error);
  });
});



// Get all books based on title

// Original solution
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const booksArray = Object.values(books);
//   const titleBooks = booksArray.filter(book => book.title === title);
//   titleBooks.length > 0 ? res.status(200).json(titleBooks) : res.status(404).json({message: "Title not found"});
// });

// Solution with promise callbacks
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksArray = Object.values(books);
    const titleBooks = booksArray.filter(book => book.title === title);
    if (titleBooks.length > 0) {
      resolve(titleBooks);
    } else {
      reject({message: "Title not found"});
    }
  })
  .then((titleBooks) => {
    res.status(200).json(titleBooks);
  })
  .catch((error) => {
    res.status(404).json(error);
  });
});

//  Get book review

// Original solution
// public_users.get('/review/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   books[isbn] ? res.status(200).json(books[isbn].reviews) : res.status(404).json({message: "Book not found"});
// });

// Solution with promise callbacks
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn].reviews);
    } else {
      reject({message: "Book not found"});
    }
  })
  .then((reviews) => {
    res.status(200).json(reviews);
  })
  .catch((error) => {
    res.status(404).json(error);
  });
});

module.exports.general = public_users;
