const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//heck if a user with the given username already exists
const isValid = (username) => { //returns boolean
    //Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    //Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

//Check if the user with the given username and password exists
const authenticatedUser = (username,password)=>{ //returns boolean
    //Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    //Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  //Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  //Authenticate user
  if (authenticatedUser(username, password)) {
    //Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    //Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; //Retrieve ISBN
  let book = books[isbn]; // Find the book
  const username = req.session.authorization?.username; //Get the logged in username

  //Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not logged in or session expired." });
  }

  //Check if book exists
  if (book) {
    let review = req.body.review;
    if (review) {
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review successfully added/updated!"});
    } else {
        return res.status(400).json({ message: "Review content is required."});
    }
  }

  return res.status(404).json({ message: "Book not found" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; //Retrieve ISBN
    let book = books[isbn];
    const username = req.session.authorization?.username;

    //Check if book exists
    if (book) {
        //Check if user has a review for the book
        if (book.reviews[username]){
            delete book.reviews[username]; //Delete the users review
            res.status(200).json({ message: `Your review for ${book.title} has been deleted.`})
        } else {
            res.status(403).json({ message: "You have not posted a review for this book."});
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
