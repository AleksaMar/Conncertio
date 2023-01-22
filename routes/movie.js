/**
 * Fajl sa rutama za Movie entitet. Sve rute pocinju prefiksom /movie
 * Ovde ne pisemo prefiks jer smo ovaj movie.js uvezali u express() instancu i naveli /movie prefix u app.js
 */

const express = require("express");
const route = express.Router();  //umesto app ovde koristimo route


/**
 * Potrebni modeli za rute u ovom fajlu
 */
const Movie = require("../models/Movie");


/**
 * Ruta koja dohvata po id-u.  Adresa je http://localhost:8000/movie/ID
 */
route.get("/:_id", async (req, res)=>{
    //pronadjemo
    let movies = await Movie.find({
        _id: req.params._id
    });
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 404
    if(movies){
        res.send(movies);
    }
    else {
        res.status(404);
    }
});


/**
 * Pravimo rutu koja dohvata film po imenu, koristimo Movie model
 * adresa je localhost:8000/movie/nadji/NESTO
 * :title je placeholder za deo linka koji ce da se ubaci u promenljivu u req objektu: req.params.title
 */
route.get("/nadji/:title", async (req,res)=>{
    //ispisujemo u konzolu na serveru
    console.log("TRAZIMO " + req.params.title);
    //trazimo u kolekciji zapise koji lice na objekat-objekat ima samo title atribut
    let movies = await Movie.find({
        title: req.params.title
    });
    //ispisujemo u konzolu na serveru, za eventualni debug
    console.log("NADJENO:");
    console.log(movies);
    //saljemo klijentu json odgovor
    res.send(movies);
});



/**
 * Ruta za kreiranje novog objekta u kolekciji
 * Prihvata podatke kao POST request u kome se u body nalazi JSON sadrzaj
 * Ovo vec ne mozes da testiras kroz browser. U visual studio code imas thunderclient ekstenziju, instaliraj to
 * Pa onda otvori novi request i pisi url http://localhost:8000/movie/ i levo od toga izaberi POST umesto GET
 * a ispod toga u body tabu upisi json sadrzaj koji hoces da posaljes ovoj ruti.
 * Mobilna aplikacija ce slati takav podatak kad bude slala zahtev
 */
route.post("/", async(req, res)=>{
    //primer json zahteva koji saljemo - kopiraj ovo u body requesta u thunder client
    /*
{
    "title":"Novi film",
    "directors":["Leka","Branko"]
}
    */
    //json koji smo poslali u body ce biti isparsovan kroz body-parser i u body imamo spreman objekat
    
    //sada hocemo da napravimo novi Movie model (objekat) i napunimo ga podacima iz req.body, pa da sacuvamo to

    let noviFilm = new Movie();
    noviFilm._id=req.body._id;
    noviFilm.title = req.body.title;
    noviFilm.directors = req.body.directors;

    console.log(noviFilm);

    await noviFilm.save();  //ovo salje poruku na mongo 

    res.send(noviFilm); //kao odgovor vratimo json tog modela koji je kreiran, ovde treba da imamo i ID
});

//ucinimo definisane rute dostupnim u app.js
module.exports= route;
