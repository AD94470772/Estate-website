import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 4444;
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://mern-estate-project-nthk.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
const __dirname = path.resolve();

import googlePassport from "./authentication/googleAuth.js";
app.use(googlePassport.initialize());
app.get(
  "/auth/google",
  googlePassport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/auth/google/callback",
  googlePassport.authenticate("google", {
    failureRedirect: "https://mern-estate-project-nthk.vercel.app/sign-in",
    session: false,
  }),
  function (req, res) {
    const token = jwt.sign({ user: req.user }, "jhggyytftyfmm", {
      expiresIn: "1h",
    });
    res
      .status(200)
      .redirect(
        `https://mern-estate-project-nthk.vercel.app/redirect-to-home?user=${encodeURIComponent(
          JSON.stringify(token)
        )}`
      );
  }
);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.get("/", (req, res, next) => {
  res.send("My Mern  Estate Project");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log("http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
