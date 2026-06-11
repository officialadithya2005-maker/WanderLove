const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");








// Review creation route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

router.delete(
    "/:reviewId",
    isReviewAuthor,
    isLoggedIn,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;