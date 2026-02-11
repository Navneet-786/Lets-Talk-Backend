require("dotenv").config({});
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
// import dotenv from "dotenv";
// dotenv.config();

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const userSocketMap = {
  // userId : socketId,
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) return;

  userSocketMap[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

module.exports = { io, app, server, getSocketId };
