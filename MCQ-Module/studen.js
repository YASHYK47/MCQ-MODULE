const mongoose =require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

var Userstudschema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Why no name'],
    minlength:4
    },
  gender:{
      type:String,
      enum:['Male','Female','Other'],
      required:[true,'Necessary']
    },
  email:{
    type:String,
    required:[true,'Field Necessary'],
    minlength:8,
    trim:true,
    unique:true,
    validate:{
      validator:(value)=>{
        return validator.isEmail(value);
      },
      message:'{VALUE} is not a valid email'
    }
  },
  admno:{
    type:String,
    required:[true,'Field Necessary'],
    minlength:7,
    trim:true
  },
  year:{
    type:Number,
    required:[true,'Field Necessary'],
    minlength:1
  },
  password:{
    type:String,
    required:[true,'Field Necessary'],
    minlength:8,
  },
  mobno:{
    type:Number,
    required:[true,'Field Necessary'],
    minlength:10
  },
  score:{
    type:Number,
    default:0
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});
Userstudschema.methods.toJSON=function(){
  var user=this;
  var userObject=user.toObject();
  return _.pick(userObject,['_id','name','gender','email','admno','mobno','year','score']);
}
Userstudschema.methods.generateAuthToken=function(){
  var user=this;
  var access='auth';
  var token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  });
};

Userstudschema.pre('save',function(next){
  var user=this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password=hash;
        next();
      })
    })
  }else{
    next();
  }
})
var Userstud=mongoose.model('Userstud',Userstudschema);
module.exports={
  Userstud
};
