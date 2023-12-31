const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({origin:'https://toy-store-98bee.web.app'}))




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzmtgtr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const toysCollection = client.db("toysDB").collection("toys");

    app.get('/alltoys/:category', async(req, res ) =>{

     if(req.params.category == "Sports" || req.params.category =="Classic" || req.params.category == "Trucks"){
      const result = await toysCollection.find({subCategory: req.params.category}).toArray()
     return res.send(result)
    }
    const result = await toysCollection.find({}).toArray()
      res.send(result)
    
     })
    
     app.get('/myToys/:email', async(req, res) =>{
      const result = await toysCollection.find({email: req.params.email}).toArray()
      res.send(result)
     })


  app.post('/toys', async(req, res) =>{
    const body =req.body;
    const result = await toysCollection.insertOne(body)
    res.send(result)
  })

   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res ) =>{
res.send('toy is running in server')
})

app.listen(port, () =>{
    console.log(`toy store is running on port : ${port}`)
})