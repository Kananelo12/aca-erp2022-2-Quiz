import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"


const initFirebaseAdmin = () => {
    const apps = getApps();

    // Initialize Firebase Admin SDK if no apps are initialized
    if (!apps.length) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            })
        })
    }

    // Return initialized Firebase Admin SDK services
    return {
        auth: getAuth(),
        db: getFirestore(),
    }
}
// Export the initialized Firebase Admin SDK
export const { auth, db } = initFirebaseAdmin();