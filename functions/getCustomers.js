const admin = require('firebase-admin');

async function getCustomers(req, res) {
  try {
    const snapshot = await admin.firestore().collection('customers').get();
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

module.exports = getCustomers;
