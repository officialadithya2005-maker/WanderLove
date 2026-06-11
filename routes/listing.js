const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/catchAsync");
const { listingSchema,reviewSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudconfifg.js")
const upload = multer({ storage})


router.route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing )
    );
    
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any




//New Route

router.get("/new",isLoggedIn,listingController.renderNewform);

// Edit Route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//Show Route

router.get("/:id",wrapAsync(listingController.showListing));

//Create Route


//UPDATE Route

router.put("/:id",isLoggedIn,isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateForm));

//Delete Route

router.delete("/:id",isLoggedIn,isOwner,     wrapAsync(listingController.deleteListing  ));


module.exports = router;