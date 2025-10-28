import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import blogRoute from "./routes/blogRoutes.js";

dotenv.config({});

// call database connection here
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Define the precise origins
const allowedOrigins = [
    // 1. The local development origin
    "http://localhost:5173", 
    
    // 2. The exact deployed Vercel URL (HTTPS, no trailing slash)
    "https://blogpost-fawn-beta.vercel.app", 
    
    // 3. The value pulled from the Render environment variable
    allowedOrigin,

    // 4. The URL with a trailing slash
    "https://blogpost-fawn-beta.vercel.app/",
];

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blogs", blogRoute);

app._router?.stack?.forEach((middleware) => {
  if (middleware.route) {
    console.log("Registered route:", middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log("Registered nested route:", handler.route.path);
      }
    });
  }
});

app.listen(PORT, () =>{
    console.log('server listen at port ',PORT);
})

export default app;