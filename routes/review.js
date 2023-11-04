const express = require('express'); 
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Review = require("../models/review.js");
// const {reviewSchema} = require('../schema.js');
// const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));                                                                                    

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview ));

module.exports= router;