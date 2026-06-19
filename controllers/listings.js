const Listing=require("../models/listing");
const Review=require("../models/review");

function escapeRegex(text) {
    return text.replace(/[-\\[\]{}()*+?.,\\\\^$|#\s]/g, '\\$&');
}

module.exports.index = async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search && search.trim() !== '') {
        const regex = new RegExp(escapeRegex(search.trim()), 'i');
        query = { $or: [{ location: regex }, { title: regex }, { country: regex }] };
    }
    const allListings = await Listing.find(query);
    res.render('listings/index.ejs', { allListings, search: search || '' });
};

module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    id = id.trim();

    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");

    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs",{listing});
}

module.exports.createListing= async(req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing );
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing created successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateForm=async(req,res)=>{
    let {id}=req.params;
    id = id.trim();
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    id = id.trim();
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!");
    if (deleted && deleted.reviews && deleted.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: deleted.reviews } });
    }
    console.log("Deleted listing:", deleted);
    res.redirect("/listings");
}