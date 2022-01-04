import dotenv from "dotenv";
dotenv.config();

import express from "express";
import db from "./config/db";
import routes from "./routes";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

// db setup
db();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
