
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors');
const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/firestore');

admin.initializeApp();

exports.helloWorld = onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

const corsHandler = cors({ origin: true });

exports.validateAdminPassword = onRequest((req, res) => {
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(405).send({ error: 'Method not allowed' });
    }

    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Store securely in Firebase Config
    console.log('Received password:', password); // Log the received password
    console.log('Expected password:', ADMIN_PASSWORD); // Log the expected password

    if (password === ADMIN_PASSWORD) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(401).send({ error: 'Invalid password' });
    }
  });
});

exports.notifyAdminOnNewOrder = onDocumentCreated('orders/{orderId}', async (event) => {
  const order = event.data.data();
  // console.log('Order data:', order);

  // Get all admin tokens (assuming you may have multiple admins)
  const tokensSnapshot = await admin.firestore().collection('adminTokens').get();
  const tokens = tokensSnapshot.docs.map(doc => doc.data().token).filter(Boolean);
  console.log('Admin tokens:', tokens);
  if (tokens.length === 0) {
    console.log('No admin tokens found. Exiting function.');
    return;
  };

  const message = {
    notification: {
      title: "New Order Received!",
      body: `Order from ${order.customer?.name || "a customer"}`,
    },
    webpush: {
      notification: {
        icon: "/favicon.png",
        click_action: "https://www.gotreats.in/admin/view-all-orders"
      }
    },
    tokens: tokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('FCM response:', response);
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log(`Failed to send to token ${tokens[idx]}:`, resp.error);
        }
      });
    }
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
});

// When you use httpsCallable to call a Firebase Cloud Function, 
// the Firebase client SDK automatically includes the user's authentication 
// token in the request if the user is signed in.
// The Cloud Function then  uses this token to populate the context.auth object.


// exports.validateAdminPassword = functions.https.onCall((data, context) => {

//   console.log('Auth Context:', context.auth); // undefined in logs
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       'unauthenticated',
//       'The function must be called while authenticated.'
//     );
//   }

//   const { password } = data; // undefined in logs
//   const ADMIN_PASSWORD = '7905'; // Store securely in Firebase Config
//   console.log('Received data:', data); // Log the entire data object
//   console.log('Received password:', password); // Log the received password
//   console.log('Expected password:', ADMIN_PASSWORD); // Log the expected password

//   if (password === ADMIN_PASSWORD) {
//     return { success: true };
//   } else {
//     throw new functions.https.HttpsError(
//       'permission-denied',
//       'Invalid password.'
//     );
//   }
// });