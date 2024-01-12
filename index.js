const express = require('express');
const cors = require('cors');
const multer  = require('multer')
require('dotenv').config()
const app = express()
const path = require('path');
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stv3jdc.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
      });

      const upload = multer({ storage });

    app.post('/upload', upload.single('file'), (req, res) => {
        try {
          const file = req.file;
          if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
          res.status(201).json({ filename: file.filename });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Taskify server is running")
  })
  
  app.listen(port, () => {
    console.log(`Taskify server is running on PORT:${port} `)
  })