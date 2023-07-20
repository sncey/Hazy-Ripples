const UserModel = require('./models/user')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hazyripples:kTICWLSihjpIfInv@hazy-ripples.9ylpilc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function connectToMongo() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    UserModel.init();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client; // Return the MongoClient instance after successful connection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Throw the error to be handled in the calling function
  }
}

module.exports = connectToMongo;