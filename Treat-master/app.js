const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");
const app=express();
const ejs=require('ejs');
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

const admin=mongoose.createConnection("mongodb://localhost:27017/logDB");
const user=mongoose.createConnection("mongodb://localhost:27017/RegDB");
const doctor =  mongoose.createConnection("mongodb://localhost:27017/DoctorDB");

const doctorSchema = {
     name: String,
     email: String,
     department: String,
     state: String,
     city: String,
     experience: Number,
     degree: String,
     phone: String
}

const Doctor = doctor.model("Doctor",doctorSchema);


const regSchema=new mongoose.Schema({
  full_name:String,
  email:String,
  phone:Number,
  gender:String,
  type:String,
  date:Date
});

const Reg= user.model("Reg",regSchema);

app.post("/apply",function(req,res){
  const new_reg=new Reg({
    full_name:req.body.full_name,
    email:req.body.email,
    phone:req.body.phone,
    gender:req.body.gender,
    age:req.body.age,
    type:req.body.type,
    date:req.body.date,
    price:req.body.price
  });
  new_reg.save(function(err){
    if(err){
      console.log("error");
    }else{
      res.render("final")
    }
  })
});
const logSchema={
  email:String,
  password:String
};

const Log= admin.model("Log",logSchema);


app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/loginAdmin",function(req,res){
    res.render("loginAdmin");
});
app.get("/registerAdmin",function(req,res){
    res.render("registerAdmin");
});
app.get("/logout",function(req,res){
  res.render("home")
});

app.get("/doctor",function(req,res){
  res.render("doctor");
});

app.get("/patient",function(req,res){
  res.render("patient");
});

app.post("/doctor/registered",function(req,res){
  var mail = req.body.email;
  Doctor.findOne({email:mail},function(err,result){
    if(err)  console.log(err);
    else{
      if(result)
         res.render("registered.ejs");
      else{
        const doc = new Doctor({
          name : req.body.name,
          email: req.body.email,
          department: req.body.department,
          state: req.body.state,
          city: req.body.city,
          experience: req.body.experience,
          degree: req.body.degree,
          phone: req.body.phone
        });
        doc.save(function(err){
          if(err) console.log(err);
          else res.send("<h3>You have successfully registerd as doctor</h3>");
        })

      }
    }
  })
});

app.post("/search",function(req,res){
  const department = req.body.department;
  const city = req.body.city;
  Doctor.find({department:department,city:city},function(err,results){
    if(err) console.log(err);
    else{
      res.render("show",{ListItems:results})
    }
  })
})


app.post("/register",function(req,res){
  const newLog=new Log({
    email:req.body.username,
    password:req.body.password
  });
  newLog.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("login");
    }
  });
});
app.post("/login",function(req,res){
  const newLog=req.body.username;
  const password=req.body.password;
  Log.findOne({email:newLog},function(err,founduser){
    if(err){
      console.log("error");
    }else{
      if(founduser){
        if(founduser.password===password){
          res.render("main")
        }
      }
    }
  })
})




app.listen(3000,function(){
  console.log('Server Started at port 3000');
});
