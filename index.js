import { config } from "dotenv";
import { app } from "./app.js";
import { database } from "./config/db.js";

config({
  path: "./config/config.env",
});

database();
app.listen(process.env.PORT, () =>
  console.log(`Server Running Port ${process.env.PORT}`)
);
