import mongoose from "mongoose";

export default async () => {
  await mongoose
    .connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Db Connection successful");
    })
    .catch((err) => {
      console.log("Failed to connect to db: ", err);
    });
};
