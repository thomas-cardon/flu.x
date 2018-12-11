const { SummonerPhoneData } = require('../models');

const router = require('express').Router();
const SummonerPhoneDataHelper = require('../helpers/SummonerPhoneData');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const admin = require('firebase-admin'), serviceAccount = require('private/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://flux-11667.firebaseio.com'
});

router.use(session({
  secret: Settings.secret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: require('mongoose').connection }),
  cookie: { secure: false }
}));

router.get('/v1/phone/authentify', function(req, res) {
  if (req.session.phone_authenticated) return res.send('OK');
  else if (!req.body) return res.send('MISSING_CREDENTIALS');
  else {
    try {
      let auth = await SummonerPhoneDataHelper.validate(req.body);

      if (auth === null) res.send('NO_PASSWORD');
      else if (auth === false) res.send('WRONG_PASSWORD');
      else {
        req.session.phone_authenticated = auth;
        res.send('OK');
      }
    }
    catch(err) {
      next(err);
    }
  }
});

router.post('/v1/phone/update-token', function(req, res) {
  if (req.body.token && req.session.phone_authenticated) {

  }
});

router.post('/v1/phone/change-password', function(req, res) {
  if (req.body.old_password) {

  }
  else {

  }
});

router.get('/v1/phone/notify', function(req, res) {
  if (req.session.phone_authenticated) {

  }
  else {

  }
});

module.exports = router;
