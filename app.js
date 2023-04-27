import express from "express";
import router from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("GET VALUE");
});
