    if(process.env.NODE_ENV !="production"){
        require("dotenv").config();
    }
    
    
   

    const express=require("express");
    const app=express(); 
    const mongoose=require("mongoose");
    const path=require("path");
    const methodOverride=require("method-override");
    const ejsMate=require("ejs-mate");
    const { reviewSchema } = require("./schema.js");
    const Review=require("./models/review.js");
    const listingsRouter = require("./routes/listing.js");
    const reviewsRouter = require("./routes/reviews.js");
    const Listing=require("./models/listing.js");
    const session=require("express-session");
    const {MongoStore} = require('connect-mongo');
    const flash=require('connect-flash');
    const passport=require("passport");
    const LocalStrategy=require("passport-local");
    const User=require("./models/user.js");
    const userRouter=require("./routes/user.js");

    

    // const MONGO_URL="mongodb://127.0.0.1:27017/wanderlove";
    const dbUrl=process.env.AtlasDB_URL;

    async function main(){  
        if (!dbUrl) {
            throw new Error('Missing AtlasDB_URL environment variable. Please set it in .env or your environment.');
        }
        await mongoose.connect(dbUrl);
    }

    main()
    .then(()=>{
        console.log("Connected to MongoDB");
        app.listen(8080,()=>{
            console.log("Server is running on port 8080");
        });
    })
    .catch((err)=>{
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });

    app.engine("ejs",ejsMate);
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"Views"));
    app.use(express.urlencoded({extended:true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(methodOverride("_method"));

   
    const store=MongoStore.create({
        mongoUrl:dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    }); 

    const sessionOptions={
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie :{
            expires:Date.now()+7*24*60*60*1000, 
            maxAge:7*24*60*60*1000,  
            httpOnly:true, 
        },
    }

    // app.get("/",(req,res)=>{
    //     res.send("Hello I am root");
    // });
    store.on("error",(err)=>{
        console.log("Error in mongo sesssion store",err);
    })

    


    

    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());  
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req,res,next)=>{
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.currUser=req.user;
        next();
    });

    // app.get("/demoUser",async(req,res)=>{
    //     let fakeUser=new User({
    //         email:"student@gmail.com",
    //         username:"delta-student"
    //     })

    //     let registeredUser=await User.register(fakeUser,"Hello123");
    //     res.send(registeredUser);
    // })

    app.use("/listings",listingsRouter);
    app.use("/listings/:id/reviews",reviewsRouter);
    app.use("/",userRouter);


    
    
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    });

