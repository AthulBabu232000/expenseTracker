var db = require("../config/connection");
var collection = require("../config/collections");
const ObjectId=require('mongodb').ObjectId;

module.exports = {
  enterDiary: (diaryData) => {
    console.log(diaryData);
    return new Promise(async (resolve, reject) => {
     
      db.get()
        .collection(collection.EXPENSE_COLLECTION)
        .insertOne(diaryData)
        .then((data) => {
          console.log("data about to enter");

          console.log(data);
          console.log("data entered");
          resolve(data);
        });
    });
  },
  getAllDiary:(filterUser)=>{
    return new Promise(async(resolve, reject)=>{
        console.log(filterUser);
        let diaryContent=await db.get().collection(collection.EXPENSE_COLLECTION).find({username:filterUser.username}).toArray();
        resolve(diaryContent);
    });
},

  getExpenses:()=>{
    return new Promise(async(resolve, reject)=>{
    
      let expenseContent=await db.get().collection(collection.EXPENSE_COLLECTION).find().toArray();
      resolve(expenseContent);
  });
  },
  deleteExpense: (expenseId) => {
    return new Promise(async (resolve, reject) => {
   

      db.get()
        .collection(collection.EXPENSE_COLLECTION)
        .deleteOne({ _id: ObjectId(expenseId) })
        .then((data) => {
          console.log("Expense deleted");
          console.log(data);
          resolve(data);
        })
        .catch((err) => {
          console.log("Error deleting expense");
          console.error(err);
          reject(err);
        });
    });
  }

  
};
