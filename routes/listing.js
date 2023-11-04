const express = require('express');
const router = express.Router();
//middleware required
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require('../middleware.js');
const { validateListing } = require('../middleware.js');
const listingControllers = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
//Index route and create route
router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingControllers.createListing));

// NEW route
router.get("/new", isLoggedIn,listingControllers.renderNewForm);

// SHOW route,UPDATE route and DELETE route
router.route("/:id")
.get( wrapAsync(listingControllers.showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

// EDIT or UPDATE route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));

module.exports = router;    // export router object