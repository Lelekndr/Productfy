import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();
app.use(cors({origin: ENV.FRONTEND_URL, credentials:true})); //credentials:true to allow cookies to be sent from frontend to backend so that we can authenticate the user with Clerk
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
app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/comments",commentRoutes)

app.listen(ENV.PORT, () => {
  console.log("Server is running on port:", ENV.PORT);
}).on("error", (err: Error) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
