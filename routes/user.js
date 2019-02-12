var express=require("express"),
    router=express.Router(),
    passport=require("passport");

var Product=require("../models/product"),
    Order=require("../models/order"),
    Cart=require("../models/cart");

//  User SignUP Form
router.get("/signup",function(req,res){
    res.render("user/signup");
});

// Handling signup logic
router.post("/signup",passport.authenticate("local.signup",{
    failureRedirect:"/user/signup",
    failureFlash:true
}),function(req,res,next){
    if(req.session.oldUrl){
        var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
    } else{
        res.redirect("/user/profile");
    }
});

//  User SignIn Form
router.get("/signin",function(req,res){
    res.render("user/signin");
});

// Handling signin logic
router.post("/signin",passport.authenticate("local.signin",{
    failureRedirect:"/user/signin",
    failureFlash:true
}),function(req,res,next){
    if(req.session.oldUrl){
        var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
    } else{
        res.redirect("/user/profile");
    }
});

// Handling logout logic
router.get("/logout",isLoggedIn,function(req,res,next){
    req.logout();
    res.redirect("/");
})

// Rendering Profile Page
router.get("/profile",isLoggedIn,function(req,res){
    Order.find({user:req.user},function(err,orders){
        if(err){
            return res.write("Error!");
        }
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        });
        res.render("user/profile",{orders:orders});
    })
})

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports=router;