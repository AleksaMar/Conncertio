/**
 * Fajl sa rutama za User entitet. Sve rute pocinju prefiksom /user
 * Ovde ne pisemo prefiks jer smo ovaj user.js uvezali u express() instancu i naveli /user prefix u app.js
 */

const express = require("express");
const route = express.Router();  //umesto app ovde koristimo route
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');

/**
 * Potrebni modeli za rute u ovom fajlu
 */
const User = require("../models/User");

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: err });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: err });
    
        req.user = user;
    
        next();
    });
}

//route.use(authToken);

/**
 * Ruta koja dohvata po id-u.  Adresa je http://localhost:8000/user/ID
 */
route.get("/:_id", async (req, res, next)=>{
    try{
    //pronadjemo
    let users = await User.find({
        _id: req.params._id
    });
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 404
    if(users){
        res.send(users);
    }
    else {
        res.status(404);
    }
    } catch(err){
    res.status(500).json(err);
    }
});


/*route.get("/userphoto/:_id", (req,res)=>{
    let users = User.findOne({
        _id: req.params._id
    });
    console.log(users.picture)
    res.sendFile(path.join(__dirname, 'public', 'useri', users.picture));

    });
*/
/**
 * Pravimo rutu koja dohvata usera po imenu, koristimo User model
 * adresa je localhost:8000/user/nadjipoimenu/NESTO
 * :name je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.name
 */
route.get("/nadjipoimenu/:name", async (req,res,next)=>{
    try{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.name);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo name atribut
    let users = await User.find({
        name: req.params.name
    });
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(users);
    //saljemo klijentu json odgovor
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});

/**
 * Pravimo rutu koja dohvata usera po prezimenu, koristimo User model
 * adresa je localhost:8000/user/nadjipoprezimenu/NESTO
 * :surname je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.surname
 */
route.get("/nadjipoprezimenu/:surname", async (req,res,next)=>{
    try{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.surname);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo name atribut
    let users = await User.find({
        surname: req.params.surname
    });
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(users);
    //saljemo klijentu json odgovor
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});

route.get("/nadjipoplanu/:plansid", async (req,res,next)=>{
    try{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.plansid);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo name atribut
    let users = await User.find({
        plansid: req.params.plansid
    });
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(users);
    //saljemo klijentu json odgovor
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});

//http://localhost:8000/user/slika/:_id
route.put("/slika/:_id", async (req,res)=>{
    try{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let users = await User.findByIdAndUpdate(req.params._id,{
        picture: req.body.picture,
    });
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});

//http://localhost:8000/user/dodaj/:_id
route.put("/dodaj/:_id", async (req,res)=>{
    try{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let users = await User.findByIdAndUpdate(req.params._id,{
        $push:{plansid:req.body.plansid}
    });
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});

//http://localhost:8000/user/brisi/:_id
route.put("/obrisi/:_id", async (req,res)=>{
    try{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let users = await User.findByIdAndUpdate(req.params._id,{
        $pull:{plansid:req.body.plansid}
    });
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});


//http://localhost:8000/user/:_id
route.delete("/:_id",async(req,res)=>{
    try{
    let users=await User.findByIdAndDelete(req.params._id)
    res.send(users);
    } catch(err){
    res.status(500).json(err);
    }
});

/**
 * Ruta za kreiranje novog objekta u kolekciji
 * Prihvata podatke kao POST request u kome se u body nalazi JSON sadrzaj
 * Ovo vec ne mozes da testiras kroz browser. U visual studio code imas thunderclient ekstenziju, instaliraj to
 * Pa onda otvori novi request i pisi url http://localhost:8000/user/ i levo od toga izaberi POST umesto GET
 * a ispod toga u body tabu upisi json sadrzaj koji hoces da posaljes ovoj ruti.
 * Mobilna aplikacija ce slati takav podatak kad bude slala zahtev
 */


/*route.post("/login", async (req, res)=>{
    //pronadjemo
    let users = await User.find({
        _id: req.body._id,
        pass: req.body.pass
    });
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 400
    if(users){
        const usr={
            _id:req.body._id,
            pass:req.body.pass
        }
        const token = jwt.sign(req.body._id,process.env.ACCESS_TOKEN_SECRET);
        res.json({token: token});
    }
    else {
        res.status(400).json({msg: "Ne postoji user sa unetim id i passwordom."});
    }
});

route.post("/register", async(req, res)=>{
    //primer json zahteva koji saljemo - kopiraj ovo u body requesta u thunder client
    /*
{
    "_id": "@m_axelaa_",
    "pass":"dzumijezut",
    "name": "Aleksa",
    "surname": "Maricic",
    "birthYear": 2005,
    "telnum": "+381655062789",
    "city": "Smederevska Palanka",
    "picture": "/app/public/logo.png",
    "plansid": ["63cef6561c59aed5b5621b78","63cef63d1c59aed5b5621b76"]
}
    */
    //json koji smo poslali u body ce biti isparsovan kroz body-parser i u body imamo spreman objekat
    
    //sada hocemo da napravimo novi User model (objekat) i napunimo ga podacima iz req.body, pa da sacuvamo to
/*
    let newUser = new User();
    newUser._id = req.body._id;
    newUser.pass=req.body.pass;
    newUser.name = req.body.name;
    newUser.surname = req.body.surname;
    newUser.birthYear = req.body.birthYear;
    newUser.telnum=req.body.telnum;
    newUser.city = req.body.city;
    newUser.picture =req.body.picture;
    newUser.plansid= req.body.plansid;

    console.log(newUser);

    await newUser.save();  //ovo salje poruku na mongo 

    res.send(newUser); //kao odgovor vratimo json tog modela koji je kreiran, ovde treba da imamo i ID
});*/

//ucinimo definisane rute dostupnim u app.js
module.exports= route;
