const express = require('express');
const app = express.Router();
const db = require('./utils/users');

/**
 * API to add a new user
 * request boy:
 *  - username: _
 *  - password: _
 *
 * @param {String} username the username of the user
 * @param {String} password the password of the user
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params
 *                        and 500 otherwise.
 * @returns {String} in case of success, the user token and id
 */
app.post('/user', (req, res) => {
  if(!(req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password'))) {
    res.status(400).json({status:'bad request'});
    return
  }

  const usr = req.body.username;
  const usrPassw = req.body.password;
  return db.createUser(usr, usrPassw)
    .then(token => {
      res.status(200).json({ status: 'success', user: {token: token, id: usr}})
    })
    .catch(err => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
});

/**
 * API to check if the credentials are correct
 * request params:
 *  - username: _
 *  - password: _
 *
 * @param {String} username the username of the user who wants to connect
 * @param {String} password the password of the user who wants to connect
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params
 *                        and 500 otherwise
 * @returns {String} the token of the user in case of success
 */
app.get('/user/:username/password/:password', (req, res) => {
  if(!(req.params.hasOwnProperty('username') && req.params.hasOwnProperty('password'))) {
    res.status(400).json({status:'bad request'});
    return
  }

  const usr = req.params.username;
  const passw = req.params.password;
  return db.getUser(usr, passw)
    .then(user => {
      res.status(200).json({ status: 'success', user })
    })
    .catch(err => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
});

/**
 * API to delete a user
 * request params:
 *  - username: _
 *
 * request body:
 *  - token: _
 *
 * @param {String} token the token of the user which makes the request
 * @param {String} username the username from the user that needs to be deleted
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params,
 *                        403 in case of invalid token and 500 otherwise
 */
app.delete('/user/:username', (req, res) => {
  if (!(req.params.hasOwnProperty('username') && req.body.hasOwnProperty('token')))
    return res.status(400).json({status:'bad request'});

  const token = req.body.token;
  const username = req.body.username;
  return db.isConnected(token).then(_ => {
    return db.deleteUser(username).then(_ => {
      res.status(200).json({status:'user successfully deleted'})
    }).catch(err => {
      res.status(500).json({status:`could not delete ressource. Reason: ${err.message}`})
    })
  }).catch(_ => {
    res.status(403).json({status:'permission denied'})
  })
});

/**
 * API to verify the validity of the token
 * request params:
 *  - token: _
 *
 * @param {String} token the token to be checked
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params
 *                        and 403 otherwise
 */
app.get('/isconnected/:token', (req, res) => {
  if(!(req.params.hasOwnProperty('token')))
    return res.status(400).json({status:'bad request'});

  const token = req.params.token;
  return db.isConnected(token)
    .then(_ => {
      res.status(200).json({status:'success'})
    })
    .catch(_ => {
      res.status(403).json({status: 'forbidden'})
    })
});

app.get('/', (req, res) => {
  return res.status(200).json({status:'success'})
});

module.exports = app;
