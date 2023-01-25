/**
 * Fajl sa rutama za Event entitet. Sve rute pocinju prefiksom /event
 * Ovde ne pisemo prefiks jer smo ovaj event.js uvezali u express() instancu i naveli /movie prefix u app.js
 */

const express = require("express");
const { model, Collection } = require("mongoose");
const route = express.Router();  //umesto app ovde koristimo route
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Potrebni modeli za rute u ovom fajlu
 */
const Event = require("../models/Event");

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

route.use(authToken);

route.get("/ev", async (req, res,next)=>{
    //pronadjemo
    const filter={};
   let events = await Event.find(
       filter
   ).catch(next);
   
   if(events){
    res.send(events);
    }
    else {
    res.status(404);
    }
});

/**
 * Ruta koja dohvata po id-u.  Adresa je http://localhost:8000/event/ID
 */
route.get("/:_id", async (req, res,next)=>{
     //pronadjemo
    let events = await Event.find({
        _id:req.params._id
    }).catch(next);
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 404
    if(events){
        res.send(events);
    }
    else {
        res.status(404);
    }
});

/**
 * Pravimo rutu koja dohvata event po creatoru, koristimo Event model
 * adresa je localhost:8000/event/nadjipocreatoru/NESTO
 * :creator je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.creator
 */

route.get("/nadjipoplanu/:plansid", async (req,res,next)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.creator);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo name atribut
    let events = await Event.find({
        plansid: req.params.plansid
    }).catch(next);
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(events);
    //saljemo klijentu json odgovor
    res.send(events);
});

route.get("/nadjipocreatoru/:creator", async (req,res,next)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.creator);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo name atribut
    let events = await Event.find({
        creator: {$regex:req.params.creator}
    }).catch(next);
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(events);
    //saljemo klijentu json odgovor
    res.send(events);
});

route.get("/nadjipoplaceu/:place", async (req,res,next)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.place);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo name atribut
    let events = await Event.find({
        place: {$regex:req.params.place}
    }).catch(next);
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(events);
    //saljemo klijentu json odgovor
    res.send(events);
});

route.put("/brisi/:_id", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let events = await Event.findByIdAndUpdate(req.params._id,{
        $pull:{plansid:req.body.plansid}
    });
    res.send(events);
});

//http://localhost:8000/event/:_id
route.put("/:_id", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let events = await Event.findByIdAndUpdate(req.params._id,{
        $push:{plansid:req.body.plansid}
    });
    res.send(events);
});


//http://localhost:8000/event/:_id
route.delete("/:id", async (req,res)=>{
    let events=await Event.findByIdAndDelete(req.params.id)
    res.json('succesfully deleted');
});

//http://localhost:8000/event/:_id
/*route.put("/event/:_id", (req,res)=>{
    res.send(req.body.);
});*/

/**
 * Ruta za kreiranje novog objekta u kolekciji
 * Prihvata podatke kao POST request u kome se u body nalazi JSON sadrzaj
 * Ovo vec ne mozes da testiras kroz browser. U visual studio code imas thunderclient ekstenziju, instaliraj to
 * Pa onda otvori novi request i pisi url http://localhost:8000/event/ i levo od toga izaberi POST umesto GET
 * a ispod toga u body tabu upisi json sadrzaj koji hoces da posaljes ovoj ruti.
 * Mobilna aplikacija ce slati takav podatak kad bude slala zahtev
 */
route.post("/", async(req, res)=>{
    //primer json zahteva koji saljemo - kopiraj ovo u body requesta u thunder client
    /*
{
    "name": "AC/DC u Srbiji",
    "location": [{
      "latitude": 21.545,
      "longitude": 2.342}],
    "date": "2009-05-26T22:00:00.000Z",
    "creator": "@m_axelaa_",
    "place": "Beograd",
    "description":"Za samo tri sata uzbuđeni fanovi iz Srbije uspeli su da razgrabe sve ulaznice za dugoočekivani koncert legendarne australijske grupe AC/DC koji će se održati 26. maja na stadionu Partizana u Beogradu.",
    "plansid":["123"]
}
    */
    //json koji smo poslali u body ce biti isparsovan kroz body-parser i u body imamo spreman objekat
    
    //sada hocemo da napravimo novi User model (objekat) i napunimo ga podacima iz req.body, pa da sacuvamo to

    let newEvent = new Event();
    newEvent.name = req.body.name;
    newEvent.location = req.body.location;
    newEvent.date = req.body.date;
    newEvent.creator = req.body.creator;
    newEvent.place = req.body.place;
    newEvent.description = req.body.description;
    newEvent.plansid=req.body.plansid;

    console.log(newEvent);

    await newEvent.save();  //ovo salje poruku na mongo 

    res.send(newEvent); //kao odgovor vratimo json tog modela koji je kreiran, ovde treba da imamo i ID
});

//ucinimo definisane rute dostupnim u app.js
module.exports= route;
