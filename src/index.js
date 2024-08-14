import express from "express";
import cors from "cors";
import { connectionInstance } from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

import pkg from "pg";
const { Client } = pkg;

dotenv.config({
  path: "./env",
});

//dot env configration

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {
    await client.connect();
    const res = await client.query("SELECT $1::text as connected", [
      "Connection to postgres successful!",
    ]);
    console.log(res.rows[0].connected);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {
    await client.end();
  }
})();

connectionInstance()
  .then(() => {
    app.listen(process.env.DB_PORT, () => {
      console.log(`Server is running on the port : ${process.env.DB_PORT}`);
    });
  })
  .catch((err) => {
    console.log("Postgresss connection failed", err);
  });
