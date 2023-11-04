var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let expenses=[

    {
      "item": "Groceries",
      "amount": "$100",
      "date":"2017-03-05",
      "category":"Food",
      "_id":"1",
      "person":"Athul"
    }
  ]
  res.render('index', {expenses:expenses,admin:false});
});
router.get('/enter', function(req, res, next) {
  let expenses=[

    {
      "item": "Groceries",
      "amount": "$100",
      "date":"2017-03-05",
      "category":"Food",
      "_id":"1",
      "person":"Athul"
    }
  ]
  
  res.render('users/enter-details', {expenses:expenses,admin:false});
});

module.exports = router;
