if(process.env.NODE_ENV !== "production"){  // not for deployment ,only for production
    require("dotenv").config(); 
}
console.log(process.env.CLOUD_NAME);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");    // router object 
const reviewRouter = require("./routes/review.js");  // router object 
const userRouter = require("./routes/user.js");  // router object 

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongourl: dbUrl,
    crypty:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60
});

store.on("error", (e)=>{  
    console.log("session store error", e);
});
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate method added by passport-local-mongoose

passport.serializeUser(User.serializeUser()); // how to store user in session
passport.deserializeUser(User.deserializeUser()); // how to get user out of session

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    const user = new User({ email: "hello@gmail.com",username:"abhishek"});
    const registeredUser = await User.register(user, "1234");
    res.send(registeredUser);
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// page not found middleware
app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found!", 404));
});
// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 ,message = "Something went wrong"} = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { err });
});
app.listen('8080', (req, res) => {
    console.log("server is listening for requests ");
})  