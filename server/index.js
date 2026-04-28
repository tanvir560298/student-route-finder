import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

async function getDatabase() {
  if (!database) {
    await client.connect();
    database = client.db("studentRouteDB");
    console.log("MongoDB connected");
  }
  return database;
}

app.get("/", (req, res) => {
  res.send("Student Route Finder server is running 🚀");
});

app.get("/routes", async (req, res) => {
  const db = await getDatabase();
  const routesCollection = db.collection("routes");

  const result = await routesCollection.find().toArray();
  res.send(result);
});

app.post("/routes", async (req, res) => {
  const db = await getDatabase();
  const routesCollection = db.collection("routes");

  const routeData = req.body;
  const result = await routesCollection.insertOne(routeData);
  res.send(result);
});

app.delete("/routes/:id", async (req, res) => {
  const db = await getDatabase();
  const routesCollection = db.collection("routes");

  const id = req.params.id;

  const result = await routesCollection.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

app.put("/routes/:id", async (req, res) => {
  const db = await getDatabase();
  const routesCollection = db.collection("routes");

  const id = req.params.id;
  const updatedRoute = req.body;

  const result = await routesCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        district: updatedRoute.district,
        arrivalDate: updatedRoute.arrivalDate,
        arrivalTime: updatedRoute.arrivalTime,
        phone: updatedRoute.phone,
      },
    }
  );

  res.send(result);
});

// UPDATE trip status
app.put("/routes/:id/status", async (req, res) => {
  const db = await getDatabase();
  const routesCollection = db.collection("routes");

  const id = req.params.id;
  const { status } = req.body;

  const result = await routesCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: status,
      },
    }
  );

  res.send(result);
});

app.get("/interested", async (req, res) => {
  const db = await getDatabase();
  const interestedCollection = db.collection("interested");

  const result = await interestedCollection.find().toArray();
  res.send(result);
});

app.post("/interested", async (req, res) => {
  const db = await getDatabase();
  const interestedCollection = db.collection("interested");

  const interestedData = req.body;
  const result = await interestedCollection.insertOne(interestedData);
  res.send(result);
});

app.put("/interested/:id", async (req, res) => {
  const db = await getDatabase();
  const interestedCollection = db.collection("interested");

  const id = req.params.id;
  const { status } = req.body;

  const result = await interestedCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: status,
      },
    }
  );

  res.send(result);
});

app.get("/messages/:requestId", async (req, res) => {
  const db = await getDatabase();
  const messagesCollection = db.collection("messages");

  const requestId = req.params.requestId;

  const result = await messagesCollection
    .find({ requestId: requestId })
    .toArray();

  res.send(result);
});

app.post("/messages", async (req, res) => {
  const db = await getDatabase();
  const messagesCollection = db.collection("messages");

  const messageData = req.body;
  const result = await messagesCollection.insertOne(messageData);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});