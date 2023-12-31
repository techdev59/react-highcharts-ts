const api = require("binance");
const express = require("express");
const app = express();
const server = app.listen("4000", () =>
  console.log(`Kline Data Server started on port 4000`)
);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const bRest = new api.BinanceRest({
  key: "", // Get this from your account on binance.com
  secret: "", // Same for this
  timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
  recvWindow: 20000, // Optional, defaults to 5000, increase if you're getting timestamp errors
  disableBeautification: false,
  handleDrift: true,
});
const binanceWS = new api.BinanceWS(true);
const bws = binanceWS.onKline("BTCUSDT", "1m", (data: any) => {
  io.sockets.emit("KLINE", data.kline);
});
