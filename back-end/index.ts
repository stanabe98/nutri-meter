import express from "express";
import { connectDB } from "./config/connectDB";
import dotenv from "dotenv";
import http from "http";
import userRoutes from "./routes/userRoutes";
import foodLogRoutes from "./routes/foodLogRoutes";
import foodApiRoutes from "./routes/foodApiRoutes";

dotenv.config();
connectDB(process.env.MONGO_URI);
const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/user", userRoutes);
app.use("/api/foodlog", foodLogRoutes);
app.use("/api/fatsecret", foodApiRoutes);

console.log("howdy");

const PORT = process.env.PORT;

server.listen(PORT, () => console.log("server is running on", PORT));
