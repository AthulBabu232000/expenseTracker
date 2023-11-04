var express = require('express');
var router = express.Router();

/* GET users listing. */
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
  res.render('admin/display-details', {admin:true,expenses});

});

module.exports = router;
