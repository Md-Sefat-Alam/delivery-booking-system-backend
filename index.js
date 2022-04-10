const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.npegz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("booknow_project_sunshine");
    const collectionPostData = database.collection("postData");
    const collectionBuyRequest = database.collection("BuyRequest");

    app.post("/addnewpost", async (req, res) => {
      const result = await collectionPostData.insertOne(req.body);
      res.send(result);
    });

    app.post("/buy", async (req, res) => {
      const result = await collectionBuyRequest.insertOne(req.body);
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
    app.get("/mypost/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = collectionPostData.find({ woner_email: email });
      const allpost = await cursor.toArray();
      res.send(allpost);
    });
    // for just food
    app.get("/post/food", async (req, res) => {
      const cursor = collectionPostData.find({ pType: "food" });
      const allpost = await cursor.toArray();
      res.send(allpost);
    });
    app.get("/post/furniture", async (req, res) => {
      const cursor = collectionPostData.find({ pType: "furniture" });
      const allpost = await cursor.toArray();
      res.send(allpost);
    });
    app.get("/post/mobile-ict-equipment", async (req, res) => {
      const cursor = collectionPostData.find({ pType: "mobile" });
      const allpost = await cursor.toArray();
      res.send(allpost);
    });

    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      if (id !== "undefined") {
        const query = { _id: new ObjectId(id) };
        const post = await collectionPostData.findOne(query);
        res.send(post);
      }
    });

    app.get("/my-post/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const post = collectionBuyRequest.find(query);
      const result = await post.toArray();
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("hello from node");
});

app.listen(port, () => console.log("Listening to port", port));
