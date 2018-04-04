const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./deweybike-firebase-adminsdk-jjxwg-d9b8016d17.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://deweybike.firebaseio.com"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.addReading = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const id = req.query.id;
  const measurement = req.query.measurement;

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin
    .database()
    .ref("/readings")
    .push({ id: id, measurement: measurement })
    .then(snapshot => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.status(201).send("Created");
    });
});

exports.readings = functions.https.onRequest((req, res) => {
  return admin
    .database()
    .ref("/readings")
    .once("value", function(data) {
      return res.status(200).send(data.val());
    });
});
