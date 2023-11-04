const express = require('express'); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectURL} = require("../middleware.js");
const userControllers = require("../controllers/users.js");

router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.signup));

router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectURL,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.login);

router.get("/logout",userControllers.logout);

module.exports = router;
