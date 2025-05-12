require('dotenv').config();
const openaiKey = process.env.OPENAI_API_KEY;

// Firebase Admin SDK を読み込み
const admin = require('firebase-admin');
const fs = require('fs');

// サービスアカウントキーのパス
const serviceAccount = require('./c-management-system-type-m-firebase-adminsdk-fbsvc-bfd0d6b17f.json');

// 初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestoreインスタンス
const db = admin.firestore();

// 例：customers コレクションを取得し、一覧を表示
async function listCustomers() {
  const snapshot = await db.collection('customers').get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

listCustomers();

const { OpenAI } = require('openai');

// OpenAIインスタンスを初期化
const openai = new OpenAI({
  apiKey: openaiKey,
});

async function askGPT() {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "こんにちは。今日は何日？" }],
    });

    console.log("GPTの回答:", chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API エラー:", error);
  }
}

askGPT();