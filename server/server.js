var express = require('express');
var mongoose = require('mongoose');
var morgan = require("morgan");
var passport = require("passport");
var jwt = require("jwt-simple");
var bodyParser = require('body-parser');
var bcrypt = require("bcryptjs");
var moment = require('moment');
var config = require('./config/database');
var JwtStrategy = require('passport-jwt').Strategy;
mongoose.connect('mongodb://mukuljain:mukuljain@ds151279.mlab.com:51279/agriculture');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

///app use 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());

var port = process.env.PORT || 8080;

///listen to the port
var server  = app.listen(port);

var router = express.Router();

var Schema = mongoose.Schema;

///This is the Fertilizer Schema

var FertilizerSchema = new Schema({
  name:String,
  carbamid:Number,
  nitrate:Number,
  ammonia:Number
});

///this is the appointment schema
var CropSchema = new Schema({
  name:String,
  type:String
})
///this is the user schema
var UserSchema = new Schema({
  name:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  appointments:{
    doctor_name:String,
    place:String
  }
});


///this will be for our authentication

UserSchema.pre('save',function(next){
  var user = this;
  if(this.isModified('password')||(this.isNew)){
    bcrypt.genSalt(10,function(err,salt){
      if(err){
        return next(err);
      }
      bcrypt.hash(user.password,salt,function(err,hash){
        if(err){
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }else{
    return next();
  }
});


///this will be for comparing the passowrds

UserSchema.methods.comparePassword = function(passw,cb){
  bcrypt.compare(passw,this.password,function(err,isMatch){
    if(err){
      return cb(err);
    }
    else{
      cb(null,isMatch);
    }
  });
};

///here will be our jwt strategy for our function 

var JwtStrategy = require('passport-jwt').Strategy;
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};

///this will be the user
var User = mongoose.model('User',UserSchema);
var Crop = mongoose.model('Crop',CropSchema);
var Fertilizer = mongoose.model('Fertilizer',FertilizerSchema);

router.get("/cool",function(req,res){
  res.json({message:"this is cool django api is working"});
});
///signup or register

router.route('/signup')
.post(function(req,res){
  if(!req.body.name || !req.body.password){
    res.json({sucess:false,msg:'Please pass both name and password'});
  }else{
    var newUser = new User({
    name:req.body.name,
    password:req.body.password
  });
    newUser.save(function(err){
      if(err){
        res.json({success:false,msg:'User is not saved'});
      }else{
        res.json({success:true,msg:'User is saved congrats'})
      }
    });
}
});

////authenticate the User and the password

router.route('/authenticate')
.post(function(req,res){
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

///get all the crops
router.route('/crops/all')
.get(function(req,res){
  Crop.find(function(err,crops){
    if(err){
      res.json({message:"This is an error"});
    }
    else
    {
      res.json(crops);
    }
  });
});

///get a particular crop

router.route('/crops/:cropid')
.get(function(req,res){
  Crop.findbyid(function(err){

  });
});


///post the crop

router.route('/crops/')
.post(function(req,res){
  var crop = new Crop();
  crop.name = req.body.name;
  crop.type = req.body.type;
  crop.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.json({message:"Crop created"});
    }
  });
});

///get all the fertilizers

router.route('/fertilizers/all')
.get(function(req,res){
  Fertilizer.find(function(err,fertilizers){
    if(err){
      res.send(err);
    }
    else{
      res.json(fertilizers);
    }
  });
});

///post the fertilizer

router.route('/fertilizer')
.post(function(req,res){
  var fertilizer = new Fertilizer();
  fertilizer.name = req.body.name;
  fertilizer.carbamid = req.body.carbamid;
  fertilizer.nitrate = req.body.nitrate;
  fertilizer.ammonia = req.body.nitrate;

  fertilizer.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.json({message:"Fertilizer Created"});
    }
  }) 
});

///get all the crops
app.use("/",router);
console.log("magic is happening on port "+port);
///connection to the database ends
