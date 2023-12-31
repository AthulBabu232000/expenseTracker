var express = require("express");
var router = express.Router();
var userHelper = require("../helpers/user-helper");
var expenseHelper = require("../helpers/expense-helper");
var collect = require("../config/collections");
const multer = require("multer");
var path = require("path");
// 6611675cb11bbcd clientid for imgur
// 49e06ada7b2a6b1c68d57d7a6a99f8b9cb61787b client secret for imgur

var finalImageUrl='';
const axios = require('axios');
const fs = require('fs');

const clientId = '6611675cb11bbcd';

// Function to upload an image
async function uploadImage(filePath) {
  const file = fs.readFileSync(filePath, 'base64');

  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: file },
      {
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      }
    );

    console.log('Image uploaded. Link:', response.data.data.link);
    finalImageUrl=response.data.data.link;
    return finalImageUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
  }
}

// Example usage


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/"); // image will be stored in public folder images folder 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/write", function (req, res, next) {
  let user = req.session.user;
  if (user) {
    res.render("user/user-write", {
      title: "Express",
      admin: false,
      user: user,
    });
  } else {
    res.redirect("/login");
  }
});
router.get("/login", (req, res) => {
  res.render("user/login");
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.get("/alreadyuser", (req, res) => {
  res.render("user/alreadyuser");
});
router.post("/signup", (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    // console.log(response);
    if (
      response == "$2b$10$S/kte5Zu/jjqn73C3U8XfevCTBteNPtN8RzYGeubL1VQMQgN5J5x."
    ) {
      res.redirect("/alreadyuser");
    } else {
      res.redirect("/login");
    }
  });
});
router.post("/login", (req, res) => {
  // console.log(req.body);
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.get("/noAccount", (req, res) => {
  res.render("/");
});
router.post("/user-write", upload.single("inputImage"), async (req, res) => {
  let user = req.session.user;

  if (user) {
    var body1 = req.body;
    var body2 = req.file;
    const imageUrl=await uploadImage(body2.path); // I should have used try catch block but it is fine for now
   body2.path=imageUrl;
    const finalBody = Object.assign({}, body1, body2);
    
    expenseHelper.enterDiary(finalBody).then((response) => {
      res.redirect("/");
    });
  } else {
    res.redirect("/noAccount");
  }
});
router.get("/allexpenses", function (req, res, next) {
  expenseHelper.getExpenses().then((expenseCont) => {
    let spentAmount = 0;
    for (let i = 0; i < expenseCont.length; i++) {
      spentAmount += parseInt(expenseCont[i].inputAmount);
    }
    let finalAmount = collect.WALLET_BALANCE - spentAmount;
    spentAmount = 0;
    res.render("user/list-expenses", { expenseCont, finalAmount });
  });
});
router.get("/", function (req, res, next) {
  let user = req.session.user;

  if (user) {
    expenseHelper.getAllDiary(user).then((expenseContent) => {
      // var result = md.render(diaryContent.markdown);
      let spentAmount = 0;
      for (let i = 0; i < expenseContent.length; i++) {
        spentAmount += parseInt(expenseContent[i].inputAmount);
      }
      let finalAmount = collect.WALLET_BALANCE / 3 - spentAmount;
      spentAmount = 0;
      res.render("user/user-read", {
        expenseContent: expenseContent,
        user: user,
        finalAmount,
      });
    });
  } else {
    res.redirect("/login");
  }
});


router.post("/delete-expense", function (req, res) {
  let expenseId = req.body.expenseId;
  expenseHelper.deleteExpense(expenseId).then((response) => {
    res.redirect("/");
  });
});
router.get("/monthlydetails",function(req,res){
  res.render('user/monthly-details')
})
module.exports = router;
