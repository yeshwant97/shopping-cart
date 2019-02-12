var express=require("express"),
    app=express(),
    mongoose=require("mongoose"),
    seedDb=require("./seed/product-seeder"),
    session=require("express-session"),
    bodyParser=require("body-parser"),
    session=require("express-session"),
    passport=require("passport"),
    flash=require("connect-flash"),
    validator=require("express-validator"),
    MongoStore=require("connect-mongo")(session);

// Requiring Routes
var indexRoutes=require("./routes/index"),
    userRoutes=require("./routes/user");

// Requiring Passport
require("./config/passport");

// seedDb();
mongoose.connect("mongodb://localhost/shopping",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(validator());

// PASSPORT CONFIGURATION
app.use(session({
    secret:"paspport tutorial",
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge:180*60*1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//  middleware
app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated();
    res.locals.errors=req.flash("error");
    res.locals.session=req.session;
    next();
});

app.use("/",indexRoutes);
app.use("/user",userRoutes);

app.listen(3000,function(req,res){
    console.log("Server has started!");
});