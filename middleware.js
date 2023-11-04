const Listing = require("./models/listing");
const Review = require("./models/review");
const reviewSchema = require("./schema.js").reviewSchema;
const listingSchema = require("./schema.js").listingSchema;
const ExpressError = require("./utils/ExpressError.js");
module.exports.validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }
    else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }
    else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    console.log("LOGGED IN")
    if(!req.isAuthenticated()){  // authentiacate method added by passport
        req.session.redirectURL = req.originalUrl;
        req.flash("error","Please Login first!");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectURL = (req, res, next) => {
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing  = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to do that!");
       return  res.redirect(`/listings/${id}`);    
    } 
    next();
};
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review  = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to do that!");
       return  res.redirect(`/listings/${id}`);    
    } 
    next();
};