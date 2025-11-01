// lib/mongodb.ts
import { MongoClient } from "mongodb"

const uri = "mongodb://localhost:27017/"
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export default clientPromise
