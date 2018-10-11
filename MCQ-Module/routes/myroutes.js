const express=require('express');
const router=express.Router();
const _=require('lodash');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./../db/mongoose.js');
var {Userstud}=require('./../studen.js');
var {Useradmin}=require('./../admin.js');
var {Question}=require('./../question.js');

router.post('/userstud',(req,res)=>{
  var body=_.pick(req.body,['email','name','gender','year','admno','mobno','password','cpassword']);
  var user=new Userstud(body);
   user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

router.delete('/deletequestions/:id',(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Question.findByIdAndRemove(id).then((question)=>{
    if(!question){
      return res.status(404).send();
    }
    res.status(200).send('Question Deleted');
    //res.send({question});
  }).catch((e)=>{
    res.status(400).send();
  })
});

router.post('/useradmin',(req,res)=>{
  var body=_.pick(req.body,['email','name','gender','year','admno','mobno','password','cpassword']);
  var user=new Useradmin(body);
  user.save().then(()=>{
        return user.generateAuthToken();
      }).then((token)=>{
        res.header('x-auth',token).send(user);
      }).catch((e)=>{
        res.status(400).send(e);
      });
});
//to handle cross origin
// router.use(function(req,res,next){
//   res.header("Access-Control-Allow-Origin","*");
//   res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
//   next();
// });

router.get('/scores',(req,res)=>{
  Userstud.find().then((studs)=>{
    res.send({studs});
  },(e)=>{
    res.status(400).send();
  })
});

router.get('/questions',(req,res)=>{
  Question.find().then((questions)=>{
    res.send({questions});
  },(e)=>{
    res.status(400).send();
  })
});

router.patch('/updatequestion/:id',(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Question.findByIdAndUpdate(id,{$set:{
    'question':req.body.question,
    'opta':req.body.opta,
    'optb':req.body.optb,
    'optc':req.body.optc,
    'optd':req.body.optd,
    'ans':req.body.ans
    }},{new:true}).then((question1)=>{
    if(!question1){
      return res.status(404).send();
    }
    res.status(200).send({question1});
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

router.post('/addquestion',(req,res)=>{
  var body=_.pick(req.body,['question','opta','optb','optc','optd','ans']);
  var ques=new Question(body);
  ques.save().then(()=>{
    res.status(200).send("Question Succesfully Added");
  }).catch((e)=>{
    res.status(400).send("Cannot add questiion");
  })
});

router.post('/submit/:id',(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  var score1=0;
for(i=0;i<3;i++)
{var Qid=req.body.Q[i].id;
  if(!ObjectID.isValid(Qid)){
   return res.status(404).send();
 };
  ch=req.body.Q[i].ch;
  Question.findById(Qid).then((question1)=>{
    if(ch==question1.ans){
      score1=score1+1;
    }
  }).catch((e)=>{
    res.status(400).send(e);
  });
}
Userstud.findById(id).then((user)=>{
  user.score=score1;
  user.save().then((user)=>{
    res.status(200).send(`Test completed ${user.score}`);
  }).catch((e)=>{
    res.status(200).send(e);
  });
})
// Userstud.findByIdAndUpdate(id,{$set:{'score':score1}},{new:true}).then((user1)=>{
//   if(!user1){
//     return res.status(400).send();
//   } res.status(200).send(`Test Completed ${score1}`);
// }).catch((e)=>{
//   res.status(400).send(e);
// });
});

module.exports=router;
