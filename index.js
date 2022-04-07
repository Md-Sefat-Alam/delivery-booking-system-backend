const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// booknow_project
// rO98HAXU4LnZtvkI

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.npegz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

// client.connect((err) => {
//   const collection = client
//     .db("booknow_project_sunshine")
//     .collection("usersData");
//   // perform actions on the collection object
//   app.post("/addnewpost", async (req, res) => {
//     const result = collection.insertOne(req.body);
//     console.log("Hitting the database");
//     console.log(req.body);
//     res.send(result);
//   });
//   client.close();
// });

const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("booknow_project_sunshine");
    const collectionPostData = database.collection("postData");
    const collectionBuyRequest = database.collection("BuyRequest");

    app.post("/addnewpost", async (req, res) => {
      const result = await collectionPostData.insertOne(req.body);
      console.log("Hitting the database");
      console.log(req.body);
      res.send(result);
    });

    app.post("/buy", async (req, res) => {
      const result = await collectionBuyRequest.insertOne(req.body);
      console.log("Hitting the database");
      console.log(req.body);
      res.send(result);
    });

    app.get("/allbuydata", async (req, res) => {
      const cursor = collectionBuyRequest.find({});
      const allBuyData = await cursor.toArray();
      res.send(allBuyData);
    });

    app.get("/allpost", async (req, res) => {
      const cursor = collectionPostData.find({});
      const allpost = await cursor.toArray();
      res.send(allpost);
    });

    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const post = await collectionPostData.findOne(query);
      res.send(post);
    });

    app.put("/makeapproved/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateStatus = {
        $set: {
          status: "approved",
        },
      };
      const result = await collectionBuyRequest.updateOne(
        filter,
        updateStatus,
        options
      );
      res.send(result);
    });
    app.delete("/cancle-buy-request/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collectionBuyRequest.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// client.connect((err) => {
//   const collection = client
//     .db("booknow_project_sunshine")
//     .collection("usersData");
//   // perform actions on the collection object
//   console.log("Hitting the database");
//   client.close();
// });

app.get("/", (req, res) => {
  res.send("hello from node");
});

app.listen(port, () => console.log("Listening to port", port));
