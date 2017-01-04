const express = require('express');
const undefsafe = require('undefsafe');
const parse = require('url').parse;
const { urlToArray } = require('./utils');
const router = express.Router();
module.exports = router;

function urlToPath(url) {
  return urlToArray(parse(url).path).slice(1, -1).join('.');
}

router.use((req, res, next) => {
  if (!req.user) {
    return next(401);
  }

  next();
});

router.get('*', (req, res) => {
  const path = urlToPath(req.originalUrl);
  res.send(req.user.public.includes(path));
});

router.put('*', (req, res) => {
  const path = urlToPath(req.originalUrl);
  const user = req.user;
  console.log(path);
  if (!user.public.includes(path)) {
    user.public.push(path);
  }
  user.markModified('public');
  user.save().then(() => res.send(true));
});

router.delete('*', (req, res) => {
  const path = urlToPath(req.originalUrl);
  const user = req.user;
  user.public = user.public.filter(_ => _ !== path);
  user.markModified('public');
  user.save().then(() => res.send(true));
});