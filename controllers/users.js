const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");;
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
    let newUser = new User({
        username,email
    });
    const registeredUser = await User.register(newUser,password);  // throws error if user already exists
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
  
}catch(e){
    req.flash("error","user already registered! Please login");
    res.redirect("/signup");
}}

module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    console.log(req.session );
    req.flash("success","Welcome back!");
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);    
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
}