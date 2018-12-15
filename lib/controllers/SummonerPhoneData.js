const { SummonerPhoneData } = require('../models');

const router = require('express').Router();
const SummonerPhoneDataHelper = require('../helpers/SummonerPhoneData');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: Settings.firebase_projectId,
    clientEmail: Settings.firebase_clientEmail,
    privateKey: Settings.firebase_privateKey,
    private_key: Settings.firebase_privateKey
  }),
  databaseURL: 'https://flux-11667.firebaseio.com'
});

router.use(session({
  secret: Settings.secret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: require('mongoose').connection }),
  cookie: { secure: false }
}));

router.get('/v1/phone/authentify', async function(req, res, next) {
  if (req.session.phone_authenticated) return res.send('OK');
  else if (!req.body) return res.send('MISSING_CREDENTIALS');
  else {
    try {
      let auth = await SummonerPhoneDataHelper.validate(req.body);

      if (auth.isValid === null) res.send('NO_PASSWORD');
      else if (auth.isValid === false) res.send('WRONG_PASSWORD');
      else {
        req.session.phone_authenticated = auth.isValid;
        req.session.phone_data = auth.data;

        res.send('OK');
      }
    }
    catch(err) {
      next(err);
    }
  }
});

router.post('/v1/phone/update-token', async function(req, res) {
  if (req.body.token && req.session.phone_authenticated) {
    req.session.phone_data.registrationToken = req.body.token;
    await req.session.phone_data.save();

    res.send('OK');
  }
  else res.send('NO')
});

router.post('/v1/phone/change-password', async function(req, res) {
  if (req.session.phone_authenticated && req.body.new_password)
    req.session.phone_data.password = await SummonerPhoneDataHelper.hash(req.body.new_password);
  else res.send('NO');
});

router.get('/v1/phone/notify', async function(req, res, next) {
  if (req.session.phone_authenticated) {
    try {
      await admin.messaging().send({
        notification: {
          title: 'You\'re in Champion Select!',
          body: 'Click here to control Manaflux from your phone'
        },
        data: {},
        token: req.session.phone_data.registrationToken
      });
    }
    catch(err) {
      next(err);
    }
  }
  else res.send('NO');
});

module.exports = router;
