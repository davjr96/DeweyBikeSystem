const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

var admin = require("firebase-admin");

var serviceAccount = require("./deweybike-firebase-adminsdk-jjxwg-d9b8016d17.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://deweybike.firebaseio.com"
});

exports.addReading = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const id = req.query.id;
  const measurement = req.query.measurement;
  var date = new Date();
  const temp = req.query.temp;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin
    .database()
    .ref("/readings")
    .push({
      id: id,
      measurement: measurement,
      date: date.toString(),
      temp: temp
    })
    .then(snapshot => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.status(201).send("Created");
    });
});

exports.readings = functions.https.onRequest((req, res) => {
  return admin
    .database()
    .ref("/readings")
    .once("value", data => {
      return res.status(200).send(data.val());
    });
});

exports.latest = functions.https.onRequest((req, res) => {
  return admin
    .database()
    .ref("/readings")
    .limitToLast(1)
    .once("value", data => {
      var json = data.toJSON();
      const keys = Object.keys(json);

      return res.status(200).send(json[keys[0]]["measurement"]);
    });
});
