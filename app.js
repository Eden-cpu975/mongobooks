
const express = require('express')
const cors = require('cors');
const {connectToDb, getDb} = require('./db.js')
//init app && middleware
const app = express()
//Db connections
app.use(cors());
app.use(express.json());
const { ObjectId } = require('mongodb');
app.use(express.json());

let db
connectToDb((err) => {
if(!err){
    db = getDb();
    console.log('📦 DB instance set');
    app.listen(3000, () => {
        console.log('app is listenning to port 3000')
    })
}
})

//routes
app.get('/bookss', (req, res) => {
    let books = [];
    db.collection('bookss')
    .find()
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({error: "Could not fetch the documents."})
    })  
});

app.get('/bookss/count', (req, res) => {//הוספת פונקציה לספירת ספרים
  if (!db) {
    return res.status(500).send({ message: 'ה-DB לא מחובר' });
  }
  db.collection('bookss')
    .countDocuments()
    .then((count) => res.status(200).json({ count }))
    .catch((err) => res.status(500).send({ message: 'שגיאה בספירה', error: err }));
});

app.get('/bookss/:id', (req, res) => {
    const bookId = req.params.id;
    let objId;

    try {
        objId = new ObjectId(bookId);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid book ID format.' });
    }
    db.collection('bookss')
    .findOne({ _id: objId })
    .then(book => {
        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json(book);
    })
    .catch(() => {
        res.status(500).json({ error: 'Could not fetch the document.' });
    });
});

    app.post('/bookss', (req, res) => {//הוספת ספר חדש
        const db=getDb();
        const book = req.body;
        db.collection('bookss')
             .insertOne(book)
            .then(result => {
         res.status(201).json(result)
         })
         .catch(err => {
         res.status(500).json({err:"Could not insert the documents."})
            })
        })


    app.put('/bookss/:id', (req, res) => { // עדכון ספר
  const bookId = req.params.id;
  const updatedBook = req.body;

  let objId;
  try {
    objId = new ObjectId(bookId);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid book ID format.' });
  }

  db.collection('bookss')
    .updateOne({ _id: objId }, { $set: updatedBook })
    .then(result => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Book not found.' });
      }
      res.status(200).json({ message: 'Book updated successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: 'Could not update the document.' });
    });
});


        app.delete('/bookss/:id', (req, res) => {//מחיקת ספר 
    if(ObjectId.isValid(req.params.id)){
        db.collection('bookss')
        .deleteOne({"_id": new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: "Could not delete the documents."})
        })
    } else {
        res.status(500).json({error: "Not a valid Document id"})
    }  
});
    


