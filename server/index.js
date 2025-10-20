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

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
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