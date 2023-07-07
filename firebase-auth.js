

const {initializeApp,cert} = require("firebase-admin/app")
const {getFirestore}=require("firebase-admin/firestore")
// const admin = require("firebase-admin");

const serviceAccount = require("./projt23-cfd18-firebase-adminsdk-aai75-f319929915.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://projt23-cfd18.appspot.com',
  databaseURL: "https://projt23-cfd18-default-rtdb.firebaseio.com"
});

// const bucket = admin.storage().bucket();
const db=getFirestore()


module.exports={ db }
// module.exports={ bucket }

