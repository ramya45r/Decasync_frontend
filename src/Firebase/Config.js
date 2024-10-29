// Config.js

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA0S2eXH7H1SNYPqmCLJKk0J-W7Fk8ePKw",
    authDomain: "manna-8bcdf.firebaseapp.com",
    projectId: "manna-8bcdf",
    storageBucket: "manna-8bcdf.appspot.com",
    messagingSenderId: "680084508263",
    appId: "1:680084508263:web:5912e94a88ed2ed5540ec2",
    measurementId: "G-2930K4ZBZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
