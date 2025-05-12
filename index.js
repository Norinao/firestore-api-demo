require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./c-management-system-type-m-firebase-adminsdk-fbsvc-bfd0d6b17f.json');

// Firebase 初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Express アプリ初期化
const app = express();
app.use(cors());
app.use(express.json());

// API: /customers → Firestoreのcustomersコレクション全件取得
app.get('/customers', async (req, res) => {
  try {
    const snapshot = await db.collection('customers').get();
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(customers);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

// ポート指定と起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});

// 顧客IDを指定して取得
app.get('/customers/:id', async (req, res) => {
  const customerId = req.params.id;

  try {
    const docRef = db.collection('customers').doc(customerId);  // ← ここ修正
    const docSnap = await docRef.get();                         // ← ここ修正

    if (docSnap.exists) {
      res.json({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
