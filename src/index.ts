import express, { json } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import supabase from "./utils/connectDB.js";
import eventsRouter from "./routes/events.js";
import authMiddleware from "./middleware/auth.middleware.js";

const app = express();
dotenv.config();
app.use(json());

const port = process.env.PORT || 3000; // flipping it will throw a ts error because 3000 is truthy so it will never evaluate the right side of the expression

const startServer = async () => {
  try {
    const { data, error } = await supabase.from("tenants").select("*");
    if (error) return console.log("Error connecting to database");
    console.log("Database Connected!");

    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();

app.use("/auth", authRouter);
app.use("/api/events", authMiddleware,eventsRouter)