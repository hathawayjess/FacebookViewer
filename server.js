var express = require('express')
var session = require('express-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var keys = require('./keys')

var app = express()

app.use(session({secret: 'some-random-string', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new FacebookStrategy({
  clientID: keys.facebook_clientId, //insert ID given by FB
  clientSecret: keys.facebook_secret, //insert secret given by FB
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me', //insert page you want to go back to here
	failureRedirect: '/login'
}), function(req, res) {
	console.log(req.session);
});

passport.serializeUser(function(userDataToSerialize, done) {  //take info given and put it in session box
  done(null, userDataToSerialize);                            //user - same as profile on lines 16&17
});

passport.deserializeUser(function(dataFromSessionToPutOnReqDotUser, done) { //
  done(null, dataFromSessionToPutOnReqDotUser);
});

app.get('/me', function(req, res) {
  res.send(req.user);
})

app.listen(3000, function() {
  console.log('listening on port 3000');
})


//remember to set URL and add platform
