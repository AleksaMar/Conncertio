/**
 * Fajl sa rutama za Event entitet. Sve rute pocinju prefiksom /event
 * Ovde ne pisemo prefiks jer smo ovaj event.js uvezali u express() instancu i naveli /movie prefix u app.js
 */

const express = require("express");
const route = express.Router();  //umesto app ovde koristimo route

/**
 * Potrebni modeli za rute u ovom fajlu
 */
const Plan = require("../models/Plan");

/**
 * Ruta koja dohvata po id-u.  Adresa je http://localhost:8000/plan/ID
 */
route.get("/:_id", async (req, res)=>{
    //pronadjemo
    let plans = await Plan.find({
        _id: req.params._id
    });
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 404
    if(plans){
        res.send(plans);
    }
    else {
        res.status(404);
    }
});

/**
 * Pravimo rutu koja dohvata plan po creatoru, koristimo Plan model
 * adresa je localhost:8000/plan/nadjipocreatoru/NESTO
 * :creator je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.creator
 */
route.get("/nadjipocreatoru/:creator", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.creator);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima creator atribut
    let plans = await Plan.find({
        creator: {$regex:req.params.creator}
    });
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(plans);
    //saljemo klijentu json odgovor
    res.send(plans);
});

//http://localhost:8000/plan/:_id
route.put("/:_id", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let plans = await Plan.findByIdAndUpdate(req.params._id,{
        $push:{usersid:req.body.usersid}
    });
    res.send(plans);
});

//http://localhost:8000/plan/brisi/:_id
route.put("/brisi/:_id", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params._id);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima _id atribut
    let plans = await Plan.findByIdAndUpdate(req.params._id,{
        $pull:{usersid:req.body.usersid}
    });
    res.send(plans);
});

//http://localhost:8000/plan/:_id
route.delete("/:id", async (req,res)=>{
    let plans=await Plan.findByIdAndDelete(req.params.id)
    res.send(plans);
});

/**
 * Ruta za kreiranje novog objekta u kolekciji
 * Prihvata podatke kao POST request u kome se u body nalazi JSON sadrzaj
 * Ovo vec ne mozes da testiras kroz browser. U visual studio code imas thunderclient ekstenziju, instaliraj to
 * Pa onda otvori novi request i pisi url http://localhost:8000/plan/ i levo od toga izaberi POST umesto GET
 * a ispod toga u body tabu upisi json sadrzaj koji hoces da posaljes ovoj ruti.
 * Mobilna aplikacija ce slati takav podatak kad bude slala zahtev
 */
route.post("/", async(req, res)=>{
    //primer json zahteva koji saljemo - kopiraj ovo u body requesta u thunder client
    /*
{
    "creator": "@m_axelaa_",
    "eventid" : "63c5cf4dfc63e2458b85bc41",
    "note": "neki note",
    "usersid":["@m_axelaa_","@branko_basaric"]
}
    */
    //json koji smo poslali u body ce biti isparsovan kroz body-parser i u body imamo spreman objekat
    
    //sada hocemo da napravimo novi User model (objekat) i napunimo ga podacima iz req.body, pa da sacuvamo to

    let newPlan = new Plan();
    newPlan.creator = req.body.creator;
    newPlan.eventid = req.body.eventid;
    newPlan.note = req.body.note;
    newPlan.usersid=req.body.usersid;

    console.log(newPlan);

    await newPlan.save();  //ovo salje poruku na mongo 

    res.send(newPlan); //kao odgovor vratimo json tog modela koji je kreiran, ovde treba da imamo i ID
});

//ucinimo definisane rute dostupnim u app.js
module.exports= route;
