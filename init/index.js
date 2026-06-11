const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlove";

main()
   .then(()=>{
    console.log("Connected to MongoDB");
   })
   .catch((err)=>{
    console.log(err);
   });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    // add owner to each item  replace the data array
    initData.data = initData.data.map(obj => ({ ...obj, owner: "6a27101bb2ad422679bc6d75" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");

}

initDB();
