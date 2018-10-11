const mongoose =require('mongoose');
const _=require('lodash');
const jwt=require('jsonwebtoken');

var Questionschema =new mongoose.Schema({
  question:{
    type:String,
    required:true,
  },
  opta:{
  type:String,
  required:true
},
optb:{
type:String,
required:true
},
optc:{
type:String,
required:true
},
optd:{
type:String,
required:true
},
ans:{
  type:String,
  required:true,
  minlength:1,
  maxlength:1
}
});

var Question=mongoose.model('Question',Questionschema);
module.exports={
  Question
};
