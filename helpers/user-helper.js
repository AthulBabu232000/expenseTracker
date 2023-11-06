var db = require("../config/connection");
var collection = require("../config/collections");

module.exports = {
  doSignup: async (userData) => {
    let alreadyExists = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({ username: userData.username });
    console.log(alreadyExists);
    if (alreadyExists === null) {
      return new Promise(async (resolve, reject) => {
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            console.log(data);
            resolve(data);
          });
      });
    } else {
      // If the user already exists, you can return an appropriate response here.
      // For example, you can return a message or status code.
      return "User already exists";
    }
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = { status: false };
      await console.log(userData.username);
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ username: userData.username });
      if (user) {
        if (userData.password === user.password) {
          console.log("Login success");
          response.user = user;
          response.status = true;
        } else {
          console.log("Login failed");
        }
      } else {
        console.log("User not found");
      }
      resolve(response);
    });
  },
};
