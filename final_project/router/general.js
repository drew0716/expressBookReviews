const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Send the books list as a response
  return res.status(200).json(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Retrieve the ISBN from the route parameter
  const isbn = req.params.isbn;
  //Check if the book exists in the books database
  if (books[isbn]) {
    return res.status(200).json(books[isbn]); //Return book details
  } else {
    return res.status(404).json({ message: "Book not found" }); //Return an error
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Retrieve the author from the route parameter
  const author = req.params.author;
  //Filter the books array to find matching authors based on parameter
  let filtered_books = Object.values(books).filter((book) => book.author.toLowerCase() === author.toLowerCase());
  //Check if any books with author exist in the books database
  if (filtered_books.length > 0) {
    return res.status(200).json(JSON.stringify({filtered_books}, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Retrieve the title from the route parameter
  const title = req.params.title;
  //Filter the books array to find matching titles based on parameter
  let filtered_books = Object.values(books).filter((book) => book.title.toLowerCase() === title.toLowerCase());
  //Check if any books with title exist in the books database
  if (filtered_books.length > 0) {
    return res.status(200).json(JSON.stringify({filtered_books}, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
