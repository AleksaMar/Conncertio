/**
 * Fajl sa rutama za User entitet. Sve rute pocinju prefiksom /user
 * Ovde ne pisemo prefiks jer smo ovaj user.js uvezali u express() instancu i naveli /user prefix u app.js
 */

const express = require("express");
const route = express.Router();  //umesto app ovde koristimo route

/**
 * Potrebni modeli za rute u ovom fajlu
 */
const User = require("../models/User");

/**
 * Ruta koja dohvata po id-u.  Adresa je http://localhost:8000/user/ID
 */
route.get("/:_id", async (req, res)=>{
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
});

route.get("/login/:_id", async (req, res)=>{
    //pronadjemo
    let users = await User.find({
        _id: req.params._id,
        pass:req.body.pass
    });
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 404
    if(users){
        res.send(users);
    }
    else {
        res.status(404).send("Ne postoji user sa unetim id i passwordom.");
    }
});

/**
 * Pravimo rutu koja dohvata usera po imenu, koristimo User model
 * adresa je localhost:8000/user/nadjipoimenu/NESTO
 * :name je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.name
 */
route.get("/nadjipoimenu/:name", async (req,res)=>{
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
});

/**
 * Pravimo rutu koja dohvata usera po prezimenu, koristimo User model
 * adresa je localhost:8000/user/nadjipoprezimenu/NESTO
 * :surname je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.surname
 */
route.get("/nadjipoprezimenu/:surname", async (req,res)=>{
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
});

//http://localhost:8000/user/:_id
route.put("/:_id", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let users = await User.findByIdAndUpdate(req.params._id,{
        picture: req.body.picture,
    });
    res.send(users);
});

//http://localhost:8000/user/:_id
route.delete("/:_id",async(req,res)=>{
    let users=await User.findByIdAndDelete(req.params._id)
    res.send(users);
});

/**
 * Ruta za kreiranje novog objekta u kolekciji
 * Prihvata podatke kao POST request u kome se u body nalazi JSON sadrzaj
 * Ovo vec ne mozes da testiras kroz browser. U visual studio code imas thunderclient ekstenziju, instaliraj to
 * Pa onda otvori novi request i pisi url http://localhost:8000/user/ i levo od toga izaberi POST umesto GET
 * a ispod toga u body tabu upisi json sadrzaj koji hoces da posaljes ovoj ruti.
 * Mobilna aplikacija ce slati takav podatak kad bude slala zahtev
 */
route.post("/", async(req, res)=>{
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
    "picture": "/app/public/logo.png"
}
    */
    //json koji smo poslali u body ce biti isparsovan kroz body-parser i u body imamo spreman objekat
    
    //sada hocemo da napravimo novi User model (objekat) i napunimo ga podacima iz req.body, pa da sacuvamo to

    let newUser = new User();
    newUser._id = req.body._id;
    newUser.pass=req.body.pass;
    newUser.name = req.body.name;
    newUser.surname = req.body.surname;
    newUser.birthYear = req.body.birthYear;
    newUser.telnum=req.body.telnum;
    newUser.city = req.body.city;
    newUser.picture =req.body.picture;

    console.log(newUser);

    await newUser.save();  //ovo salje poruku na mongo 

    res.send(newUser); //kao odgovor vratimo json tog modela koji je kreiran, ovde treba da imamo i ID
});

//ucinimo definisane rute dostupnim u app.js
module.exports= route;
