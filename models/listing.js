const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImageUrl = "https://unsplash.com/photos/sunlight-peeking-through-rocky-mountain-peaks-at-sunrise-5z4GbvfNbSw";

const imageSchema = new Schema({
    filename: {
        type: String,
        default: "listingimage",
    },
    url: {
        type: String,
        default: defaultImageUrl,
        set: (v) => (v === "" ? defaultImageUrl : v),
    },
}, { _id: false });

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        url:String,
        filename:String,
    },

    price: Number,
    location: String,
    country: String,

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;