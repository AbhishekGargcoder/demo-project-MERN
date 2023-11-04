const Listing = require("../models/listing");
const Review = require("../models/review.js");
module.exports.createReview = async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id); 
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    console.log(review);
    await review.save();
    await listing.save();
    console.log("review saved to DB");
    req.flash("success", "Your Review added!");
    res.redirect(`/listings/${id}`)
}
module.exports.destroyReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{
        $pull : {reviews : reviewId}
    });
    req.flash("success", "Your Review Deleted!");
    res.redirect("/listings/"+id);
};