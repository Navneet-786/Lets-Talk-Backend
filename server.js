require("dotenv").config({});
const { app, server } = require("./socket/socket.js");
const express = require("express");
const { connectDB } = require("./db/connection1.db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Connect DB
connectDB();

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// routes
const userRoute = require("./routes/user.route.js");
const messageRoute = require("./routes/message.route.js");
const groupRoute = require("./routes/group.route.js");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/group", groupRoute);

// middlewares
const { errorMiddleware } = require("./middlewares/error.middlware.js");
app.use(errorMiddleware);

// listener
server.listen(PORT, () => {
  console.log(`your server listening at port ${PORT}`);
});
