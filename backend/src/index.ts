import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";

const app = express();
app.use(cors({origin: ENV.FRONTEND_URL}))
app.use(clerkMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message:"Welcome to Producting API - Powered by PostgreSQL, Drizzle ORM, and Clerk Auth!",
    endpoints:{
        users:"/api/users",
        products:"/api/products",
        comments:"/api/comments"
    }
  });
});

app.listen(ENV.PORT, () => {
  console.log("Server is running on port:", ENV.PORT);
}).on("error", (err: Error) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
