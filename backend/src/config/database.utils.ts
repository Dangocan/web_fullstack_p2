import mongoose from "mongoose";

const connectToDatabase = async () => {
  let connectionSuccess = false;
  const client = await mongoose
    .connect(`${process.env.DB_URL}`)
    .then((result) => {
      console.log("MongoDB connection success");
      connectionSuccess = true;
    })
    .catch((err) => {
      console.log("MongoDB connection error");
    });
  return { client, connectionSuccess };
};

export { connectToDatabase };
