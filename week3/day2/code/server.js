const express = require('express');
const bodyParser = require('body-parser');
const dataHelpers = require('./data-helpers.js');

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({extended: true}));// urlencoded data => js object

const customMiddleware = (req, res, next) => {
  console.log('custom middleware: I am run before the route handlers');
  let loggedin = true;
  if (!loggedin) {
    res.send('not authorized', 401);
  }else {
    next();
  }
};

app.use(customMiddleware)

app.set('view engine', 'ejs'); // pug  html/GUI + data

// BREAD

// BROWSE
app.get('/passwords',  (req, res) => {
  const passwords = dataHelpers.getPasswords('test@gmail.com');
  const templateVars = {passwords: passwords, test: 'this is for test'};
  res.render('index', templateVars);
})

// NEW
app.get('/passwords/new', (req, res) => {
  res.render('new', {});
});

// pattern matching routes /passwords/***
app.get('/passwords/:id', (req, res) => {
  const passwordId = req.params.id;
  const password = dataHelpers.getPassword(passwordId);
  if (!password) {
    res.send('no password found', 404);
  } else {
    const templateVars = {
      password: password,
    };
    res.render('show', templateVars);
  }
})

// Create/ADD
app.post('/passwords', (req, res) => {
  const success = dataHelpers.addPassword(req.body);
  if (success) {
    res.redirect('/passwords');
  } else {
    res.send("could not add password", 500);
  }
})

// Create/ADD
app.post('/passwords/:id/delete', (req, res) => {
  const success = dataHelpers.removePassword(req.params.id);
  if (success) {
    res.redirect('/passwords');
  } else {
    res.send("could not delete password", 500);
  }
})

app.listen(PORT, () => {
  console.log('Listening on port:', PORT);
});

