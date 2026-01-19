import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_management"
});

db.connect((err) => {
  if (err) console.error(err);
  else console.log("Connected to MySQL");
});

app.use("/api/auth", authRoutes);

app.listen(8081, () => {
  console.log("Running on port 8081");
}


);
