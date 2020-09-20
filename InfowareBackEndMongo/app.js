const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/infoware" , { useUnifiedTopology: true, useNewUrlParser: true});

const userSchema = mongoose.Schema({
    email:String,
    name:String,
    username:String,
    password:String
});

const User = mongoose.model("User",userSchema);

app.post("/register", function(req,res)
{
  Email = req.query.email;
  User.findOne({email:Email}, function(err,found)
  {
    if(!found)
    {
      Name = req.query.name;
      Uname = req.query.Uname;
      Pass = req.query.Pass;
      const user = new User({
        email:Email,
        name:Name,
        username:Uname,
        password:Pass
      })
      user.save(function(err)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {
          res.send("Added");
        }
      })
    }
    else
    {
      res.send("Registered");
    }
  })
})

app.post("/login", function(req,res)
{
  Mail = req.query.email;
  Pass = req.query.pass;
  User.findOne({email:Mail}, function(err,found)
  {
    if(!err)
    {
      if(found)
      {
        if(found.password===Pass)
        {
          res.send("auth");
        }
        else
        {
          res.send("notAuth");
        }
      }
      else
      {
        res.send("notAuth");
      }
    }
  })
})

app.get("/profile", function(req,res)
{
  Mail = req.query.email;
  User.findOne({email:Mail} , function(err,found)
  {
    if(!err)
    {
      res.send(found);
    }
  })
})

app.get("/delete", function(req,res)
{
  Id = req.query.del;
  User.findOne({_id:Id}, function(err,found)
  {
    if(found)
    {
      User.deleteOne({_id:Id} , function(err){});
      res.send("Deleted")
    }
  })
})

app.get("/editProfile", function(req,res)
{
  var Email = req.query.email;
  var EditName = req.query.Name;
  var EditUname = req.query.UserName;
  var EditPass = req.query.Password;
  User.updateOne({email:Email} , {name:EditName , username:EditUname , password:EditPass} , function(err)
  {
    if(err)
    {
      console.log(err);
    }
    res.send("done")
  })
})

app.listen(4000 ,function(req,res)
{
	console.log("Started");
});
