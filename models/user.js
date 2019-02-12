var mongoose=require("mongoose");
var bcrypt=require("bcrypt-nodejs");
// var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
    email:String,
    password:String
});

// userSchema.plugin(passportLocalMongoose);

//Encrypting password
userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(),null);
};

// Checking password is valid or not
userSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password);
};
module.exports=mongoose.model("User",userSchema);