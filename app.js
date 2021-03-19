require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const firebase = require('firebase');

const config = {
    apiKey: process.env.APP_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
})

app.post('/API/v1/register-user', async (req, res) => {
    var userInfo = req.body
    if (userInfo != undefined && userInfo.length != 0) {
        await db.collection('users').doc(userInfo.uid).set({}, { merge: true })
            .then(() => {
                res.send({
                    status: 200,
                    message: 'Saved success'
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
})

const returnNotNullFields = (data) => {
    data
    for (var propName in data) {
    if (data[propName] === null || data[propName] === undefined || data[propName] === '') {
      delete data[propName];
    }
  }
  return data
}

app.post('/API/v1/update', (req, res) => {
    const info = req.body;
    
    db.collection('users').doc(info.uid).set(returnNotNullFields(info.data), { merge: true });

});

app.post('/API/v1/user-info', (req, res) => {
    const uid = req.body;
    if (uid.uid != null) {
        
        db.collection('users').doc(uid.uid).get()
            .then((snapshot) => {
                res.json(snapshot.data());
        })
    }
});

app.post('/API/v1/photo-upload', (req, res) => {
    
    const info = req.body
    db.collection('users').doc(info.uid).set({ photo: info.link }, { merge: true });
    res.send({message: 'done'})
})

app.listen((process.env.PORT || 8000), (req, res) => {
    console.log('server is running');
})