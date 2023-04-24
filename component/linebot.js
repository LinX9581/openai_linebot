import express from "express";
import { Client } from "@line/bot-sdk";
import fetch from "node-fetch";

const router = express.Router();

const client = new Client({
  channelSecret: config.line.channelSecret,
  channelAccessToken: config.line.channelAccessToken,
});

router.post("/", async function (req) {
  if (req.body) {
    await handleEvent(req.body.events[0]);
  }
});

async function handleEvent(event) {
  try {
    let msg = event.message.text;
    let msgType = event.message.type;
    let groupId = event.source.groupId;
    let userId = event.source.userId;
    console.log(`${userId} said: ${msg}`);

    // 群組 & 個人
    if (event.source.type === "group") {
      try {
        const profile = await client.getGroupMemberProfile(groupId, userId);

        console.log("groupId:" + groupId, "userId:" + userId, "msgType: " + msgType, "displayName:\n" + profile.displayName + ":\n" + msg);

        if (groupId === "C897b733b2f8abfe9938136290efdf860") {
          chatGPT(event);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        if (msgType === "text" && config.lineIds.whiteList.includes(userId)) {
          chatGPT(event);
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function chatGPT(event) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: event.message.text }],
      }),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.openai.key}` },
    });

    const json = await response.json();
    console.log(`Token-> prompt: ${json.usage.prompt_tokens} reply: ${json.usage.completion_tokens} total: ${json.usage.total_tokens}`);
    console.log(json.choices[0].message.content.replace(/^\s+/, ""));
    client.replyMessage(event.replyToken, { type: "text", text: json.choices[0].message.content.replace(/^\s+/, "") });
  } catch (error) {
    console.error(error);
  }
}

export default router;
