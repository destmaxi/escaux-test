const bcrypt = require('bcryptjs');
const tku = require('./en-de-coders');

const users = require('nano')(process.env.DB_URL);

function equalPassws (usrPass, usrDbPass) {
  return bcrypt.compareSync(usrPass, usrDbPass)
}

function createUser (usrName, passw) {
  return new Promise((resolve, reject) => {

    users.insert(
      { 'password': bcrypt.hashSync(passw, bcrypt.genSaltSync()) },
      usrName,
      (error, success) => {
        if (success) {
          resolve(tku.encodeToken(usrName))
        } else {
          reject(
            new Error(`In the creation of user (${usrName}). Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    users.get(username, (error, success) => {
      if(success) {
        users.destroy(success._id, success._rev, (err, succ) => {
          if (succ) {
            resolve(username)
          } else {
            reject(new Error(`In deleting user (${username}). Reason: ${console.error.reason}`))
          }
        })
      } else {
        resolve()
      }
    })
  })
}

function getUser (usrName, passw) {
  return new Promise((resolve, reject) => {
    users.get(usrName, (error, success) => {
      if (success) {
        if (!equalPassws(passw, success.password)) {
          reject(new Error(`Passwords (for user: ${usrName}) do not match.`))
        }
        console.log(success);
        resolve({id: success._id, token: tku.encodeToken(usrName)});
      } else {
        reject(new Error(`To fetch information of user (${usrName}). Reason: ${error.reason}.`))
      }
    })
  })
}

function isConnected(token) {
  return new Promise((resolve, reject) => {
    let username = tku.decodeToken(token).sub; //TODO: has expire?
    users.get(username, (error, success) => {
      if (success) {
        resolve("")
      } else {
        reject(new Error(`User (${username}) doesn't exist.`))
      }
    })
  })
}

module.exports = {
  createUser,
  getUser,
  isConnected,
  deleteUser
};
