/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

const Book = mongoose.model("Book", new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
  }
}));

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});

        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));

        return res.status(200).json(formattedBooks);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send('missing required field title');
      }

      try {
        const book = new Book({
          title: title,
          comments: []
        });
        await book.save();
        return res.status(200).json({ _id: book._id, title: book.title });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
      }  
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        const result = await Book.deleteMany({});
      
        if (!result) {
          return res.status(400).json({ error: 'failed to complete delete' });
        }

        return res.status(200).send('complete delete successful');

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(200).send('no book exists');
      }

      try {
        const book = await Book.findOne({ _id: bookid });
        
        if (!book) {
          return res.status(200).send('no book exists');
        }

        return res.status(200).json(book);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(200).send('no book exists');
      }
      try {
        if (!comment) {
          return res.status(200).send('missing required field comment');
        }

        const book = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment} },
          { new: true }
        );

        if (!book) {
          return res.status(200).send('no book exists');
        }

        return res.status(200).json(book);

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(200).send('no book exists');
      }
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.status(200).send('no book exists');
        }
        return res.status(200).send('delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error'});
      }
    });
  
};
