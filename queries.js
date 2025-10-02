


/*--------------CRUD OPERATION-SECTION ONE--------------*/


/* i have run all these commands in mongo shell ...all have worked
 * 1. Find all books:
 *    db.books.find()
 *
 * 2. Find books by a specific author:
 *    db.books.find({ author: "George Orwell" })
 *
 * 3. Find books published after 1950:
 *    db.books.find({ published_year: { $gt: 1950 } })
 *
 * 4. Find books in a specific genre:
 *    db.books.find({ genre: "Fiction" })
 *
 * 5. Find in-stock books:
 *    db.books.find({ in_stock: true })
 */ 

   //----------6. findinding books in a stock with a year of greater than 1920
db.books.find({in_stock: true, published_year: { $gt: 1920 }})
  //-----------7. finding a book by genre (Fantasy)
db.books.find({ genre: "Fantasy" },{ title: 1, author: 1, price: 1, _id: 0 })
   //----------8. sorting books in asceending order
db.books.find().sort({ price: 1 })
   //----------9. sorting in decending order
db.books.find().sort({ price: -1 })
   //---------10. sorting books by tittle in asceending order skiping first 5 and returning 5 to the list of remaining document
db.books.find().sort({ title: 1 }).skip(5).limit(5)
   //---------11.updating one document where tittles = the hobbits
db.books.updateOne({title: "The Hobbit"},{$set: {price: 22.99}})
   //---------12. deleting one document
db.books.deleteOne({title: "The Da Vinci Code"})


/*--------------- AGGREGATION PIPELINES-SECTION-------------------*/

 //-----------1. Calculating average price by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
])
//-------------2. Finding author with most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 3
  }
])
//------------- 3. Grouping books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      title: 1,
      author: 1,
      published_year: 1,
      decade: {
        $subtract: [
          "$published_year",
          { $mod: ["$published_year", 10] }
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      booksInDecade: { $sum: 1 },
      bookTitles: { $push: "$title" }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
/*---------------- Indexing DEMO SECTION_3-----------------*/

//------------1. Creating  index on title field for faster searches
db.books.createIndex({ title: 1 })
//------------2. Creating compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 })

//========== QUERY WITHOUT INDEX (COLLSCAN) ===
db.books.find({  title: 'Moby Dick' }).explain("executionStats")

//============= QUERY WITH INDEX (IXSCAN) ===
db.books.find({  title: 'Moby Dick' }).explain("executionStats")