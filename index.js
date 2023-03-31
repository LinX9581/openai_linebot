import express from "express";
import bodyParser from "body-parser";
import "./global.js";
import lineRouter from './component/linebot.js';

const app = express();

app.set("views", "views/");
app.set("view engine", "ejs");
app.use(express.static("public"));

const botConfig = {
  channelSecret: config.line.channelSecret,
  channelAccessToken: config.line.channelAccessToken,
};

import line from '@line/bot-sdk'
app.use("/webhook", line.middleware(botConfig), lineRouter);
app.use(bodyParser.json());

const host = "0.0.0.0";
const port = process.env.PORT || 3008;

var server = app.listen(port, host, function() {
  console.log('Express server listening on port ' + port);
});
