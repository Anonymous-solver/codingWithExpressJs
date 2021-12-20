const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// const { json } = require('express/lib/response');
const app = express();

// const password = "tatka123456";

const uri = "mongodb+srv://tatka:tatka123456@cluster0.l3d6i.mongodb.net/tatkadb1?retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("tatkadb1").collection("products");
  app.get("/products", (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  app.get("/product/:id", (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
        res.send(documents[0]);
    })
  })
  
  app.post("/addProduct", (req, res) => {
      const product = req.body;
      // console.log(product);
      collection.insertOne(product)
      .then(result => {
          console.log("One product added");
          res.redirect('/')
      })
  })

  app.patch("/update/:id", (req, res) => {
    console.log(req.body.price)
    collection.updateOne({_id: ObjectId(req.params.id)}, 
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
    })
  })

  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
 
//   console.log("database connected");
  // perform actions on the collection object
//   client.close();
});

app.listen(5000);