const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 7000;
// middelware
app.use(cors());
app.use(express.json());

// Db Name : saadBookDb
// pass : bFLG1mqlCa4e02su;

const dbUserName = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
console.log(dbUserName, dbPassword);
// mongoDb import
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.58zpnyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// mongoDb crud
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("devsBlogDB");
    const blogCollection = database.collection("blogs");
    // const AdminCollection = database.collection("Admin");

    // here all crud oparation

    // post blog data
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
      console.log(result);
    });

    //

    // get  all data
    app.get("/blog", async (req, res) => {
      // res.send(blogs);
      const cusor = blogCollection.find();
      const result = await cusor.toArray();
      res.send(result);
    });

    // get single data

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });
    // Delete the first document in  collection

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete id ", id);
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });

    // update

    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const blogs = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateblogs = {
        $set: {
          title: blogs.title,
          description: blogs.description,
          imageLink: blogs.imageLink,
          category: blogs.category,
          author: blogs.author,
          createdAt: blogs.createdAt,
        },
      };
      const result = await blogCollection.updateOne(
        filter,
        updateblogs,
        option
      );
      res.send(result);
      console.log(result);
    });

    //  blog role api

    // post blog role
    app.post("/blogs/admin", async (req, res) => {
      const blog = req.body;
      const result = await AdminCollection.insertOne({
        blog,
        createdAt: new Date(),
      });
      res.send(result);
      console.log(result);
    });
    // get  blog role
    app.get("/blogs/admin", async (req, res) => {
      // res.send(blogs);
      const cusor = AdminCollection.find();
      const result = await cusor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Devs-Blog  Database");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
