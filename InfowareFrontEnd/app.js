const express = require("express");
const bodyParser = require("body-parser");
const md5 = require("md5");
const axios = require("axios");
const multer = require("multer");
const { response } = require("express");
const app = express();

app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

var email = "";
var Name= "";
var UserName= "";
var Password= "";

app.get("/", function(req,res)
{
    res.render("main");
})

app.get("/login", function(req,res)
{
    res.render("login");
})

app.get("/register", function(req,res)
{
    res.render("register");
})

app.post("/register", async function(req,res)
{
    const name=req.body.name
    const Uname=req.body.Uname
    email=req.body.email
    const Pass=md5(req.body.pwd)
    var status = await axios.post("http://localhost:4000/register", null,
    {
        params:
        {
            name,
            Uname,
            email,
            Pass
        }
    }).then((response)=>
    {
        if(response.data=="Added")
        {
            res.redirect("/profile");
        }
        else if(response.data=="Registered")
        {
            res.redirect("/register");
        }
        else
        {
            res.redirect("/register");
        }
    }).catch(err=>{
        res.redirect("/");
    });
})

app.post("/login" , async function(req,res)
{
    email = req.body.email;
    const pass =  md5(req.body.pwd);
    var status = await axios.post("http://localhost:4000/login", null,
    {
        params:
        {
            email,
            pass
        }
    }).then((response)=>
    {
        if(response.data=="auth")
        {
            res.redirect("/profile");
        }
        else if(response.data="notAuth")
        {
            res.redirect("/login");
        }
    }).catch(err=>{
        res.redirect("/login");
    });
})

app.get("/profile" , async function(req,res)
{
    try
    {
        var res = await axios.get("http://localhost:4000/profile",
        {
            params:
            {
                email
            }
        }).then((response)=>
        {
            if(response.data!="No Data Found")
            {
                Name=response.data.name;
                UserName=response.data.username;
                Password=response.data.password;
                res.render("profile" , {name:response.data.name, uname:response.data.username ,email:response.data.email ,id:response.data._id});
            }
        })
    }
    catch(e)
    {

    }
})

app.get("/delete/:id", async function(req,res)
{
    try
    {
        const del = req.params.id;
        console.log(del);
        var res = await axios.get("http://localhost:4000/delete",
        {
            params:
            {
                del
            }
        }).then((response)=>
        {
            if(response.data=="Deleted")
            {
                res.redirect("/")
            }
            else
            {
                res.redirect("/profile");
            }
        })
    }
    catch(e)
    {

    }
})

app.get("/edit/:id", function(req,res)
{
    res.render("edit");
})

app.post("/editProfile", async function(req,res)
{ 
    var ename = req.body.name;
    var euname = req.body.Uname;
    var epass = md5(req.body.pwd);
    if(ename!="")
    {
        if(Name!=ename)
        {
            Name=ename;
        }
    }
    if(euname!="")
    {
        if(UserName!=euname)
        {
            UserName=euname;
        }
    }
    if(epass!="")
    {
        if(md5(Password)!=epass)
        {
            Password=epass;
        }
    }
    var res = await axios.get("http://localhost:4000/editProfile",
    {
        params:
        {
            email,
            Name,
            UserName,
            Password
        }
    }).then((response)=>
    {
        if(response.data=="done")
        {
            res.redirect("/profile");
        }
    })
})

app.listen(3000 ,function(req,res)
{
	console.log("Started");
});