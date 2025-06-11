import { messaging } from '../config/firebaseConfig';
import { getToken } from "firebase/messaging";

export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, { vapidKey: "BGkAE1T1WKqpr4Qdhee6LNQ56ZP1ZK8LvK55xTjWScXksVMFHDsJpe7DyYb8iQpdRBdlHtPWM03O9DGpDIWzq4Y" });
        if (currentToken) {
            // Save this token to Firestore under admin user
            console.log('currentToken', currentToken);
            return currentToken;
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};

export async function requestNotificationPermision() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log('Notification permission granted');

    } else {
        console.log('Notification permission denied');

    }
}