const admin = require('firebase-admin');
const Cashfree = require('cashfree-pg').Cashfree;
const { v4: uuidv4 } = require('uuid'); // Import uuid
const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("onRequest from Firebase Cloud Functions!");
});


exports.helloWorldCall = functions.https.onCall((data, context) => {
    return { message: "Data from Cloud Function" }
});

admin.initializeApp();

// Configure Cashfree (use environment variables for security)
Cashfree.XClientId = "TEST430329ae80e0f32e41a393d78b923034";
Cashfree.XClientSecret = "TESTaf195616268bd6202eeb3bf8dc458956e7192a85";
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Or Cashfree.Environment.PRODUCTION

// Create Order (onCall)
exports.createCashfreeOrder = functions.https.onCall(async (data, context) => {
  try {
    const { amount, customerDetails } = data;

    // Generate a unique order ID
    const orderId = `order_${uuidv4().substring(0, 8)}`;

    const request = {
      order_amount: parseFloat(amount) || 264.00,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails?.customerId || "devstudio_user",
        customer_phone: customerDetails?.phone || "7905146102",
        customer_name: customerDetails?.name || "Harshith",
        customer_email: customerDetails?.email || "test@cashfree.com"
      },
      order_meta: {
        return_url: `https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id=${orderId}`
      }
    };

    const response = await Cashfree.PGCreateOrder("2025-01-01", request);
    return {
      success: true,
      data: response.data,
      orderId: orderId
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new functions.https.HttpsError('internal', error.response?.data?.message || 'Failed to create order');
  }
});

// Fetch Payment Details (onCall)
exports.fetchCashfreePaymentDetails = functions.https.onCall(async (data, context) => {
  try {
    const { orderId } = data;

    const response = await Cashfree.PGOrderFetchPayments("2025-01-01", orderId);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw new functions.https.HttpsError('internal', error.response?.data?.message || 'Failed to fetch payment details');
  }
});