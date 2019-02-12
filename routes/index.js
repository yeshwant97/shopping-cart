var express=require("express"),
    router=express.Router(),
    Cart=require("../models/cart"),
    Order=require("../models/order");

var Product=require("../models/product");

// Rendering HomePage
router.get("/",function(req,res){
    var successMsg=req.flash("success")[0];
    Product.find({},function(err,allProducts){
        if(err){
            console.log(err);
        } else{
            res.render("shop/index",{title:"Shopping Cart",products:allProducts,successMsg:successMsg,noMessages:!successMsg});
        }
    })
});

router.get("/add-to-cart/:id",function(req,res){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId,function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product,product._id);
        req.session.cart=cart;
        res.redirect("/");
    });
});

router.get("/shopping-cart",isLoggedIn,function(req,res){
    if(!req.session.cart){
        return res.render("shop/shopping-cart",{products:null});
    }
    var cart=new Cart(req.session.cart);
    res.render("shop/shopping-cart",{products:cart.generateArray(),totalPrice:cart.totalPrice});
});

router.get("/checkout",function(req,res){
    if(!req.session.cart){
        res.redirect("/shopping-cart");
    }
    var cart=new Cart(req.session.cart);
    res.render("shop/checkout",{total:cart.totalPrice});
});

router.post("/checkout",isLoggedIn,function(req,res){
    if(!req.session.cart){
        res.redirect("/shopping-cart");
    }
    var cart=new Cart(req.session.cart);
    var stripe = require("stripe")("sk_test_phQ7Gr7BKKF2OThZQbmM5kZF");

    stripe.charges.create({
        amount: cart.totalPrice*100, //in cents
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: " Test Charge"
    }, function(err, charge) {
        if(err){
            req.flash("error",err.message);
            return res.redirect("/checkout");
        }
        var order=new Order({
            user:req.user,
            cart:cart,
            address:req.body.address,
            name:req.body.name,
            paymentId:charge.id
        });
        order.save(function(err,result){
            req.flash("success","Successfully bought product!");
            req.session.cart=null;
            res.redirect("/");
        });
    });
});

router.get("/reduce/:id",function(req,res){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart=cart;
    res.redirect("/shopping-cart");
});

router.get("/remove/:id",function(req,res){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart=cart;
    res.redirect("/shopping-cart");
});

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl=req.url;
    res.redirect("/user/signin");
}

module.exports=router;