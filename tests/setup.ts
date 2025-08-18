import mongoose from "mongoose";

const dbUri = process.env.DB_URI || "mongodb://localhost:27017/football";

beforeAll(async () => {
  await mongoose.connect(dbUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});