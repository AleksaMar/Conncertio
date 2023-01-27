//web server
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fileUpload = require('express-fileupload');

//middleware koji automatski prepakuje JSON podatke iz requesta u objekat (radi json.parse() tamo gde treba)
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

//middleware koji nam omogucava da /public folder bude javno dostupan, da ne moramo da pisemo rute koje ce da serviraju fajlove unutar ovog folera
//ovo moze da nam bude zgodno za slike, ako budemo cuvali slike. mada bi bilo pametno da nahvatamo neki storage server u tom slucaju, tipa dropbox
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))

const User = require("./models/User");

//konekcija za mongo
const mongoose = require("mongoose");
//mongo string, string je generisan u atlasu, na overview pa desno ima connect
const MONGO_CONNECTION_STRING = "mongodb+srv://admin:LrT5ANbZCuT6AmB2@conncertio.ogxryb2.mongodb.net/?retryWrites=true&w=majority";

//modele ucitavamo tamo gde nam trebaju u rutama, ne treba nam ovde

//rute

app.get("/userphoto/:_id", (req,res)=>{
    let users = User.findOne({
        _id: req.params._id
    });

    //console.log(req.params._id)
    //console.log('https://prvulovic.com/conncertio/'+req.params._id+'.png')
    res.send('https://prvulovic.com/conncertio/'+req.params._id+'.png');
    });

app.post('/userphoto/upload/', (req, res) => {
    // Get the file that was set to our field named "image"
    //const { image } = req.files;
    
console.log(req);
res.send(req);

    // If no image submitted, exit
    //if (!image) return res.sendStatus(400);
    
    //image.name=req.params._id;

    // Move the uploaded image to our upload folder
    //res.send('https://prvulovic.com/conncertio/'+image+'.png');
    //image.('https://prvulovic.com/conncertio/' + image.name+'.png');
     //res.sendStatus(200);
    });

//home ruta: http://localhost:8000/
app.get("/", (req, res)=>{
    res.send("Pozdrav sa servera!");
});

//movie rute: http://localhost:8000/movie/...
const movieRoutes = require("./routes/movie");
app.use("/movie", movieRoutes);

//user rute: http://localhost:8000/user/...
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

//event rute: http://localhost:8000/event/...
const eventRoutes = require("./routes/event");
app.use("/event", eventRoutes);

//plan rute: http://localhost:8000/plan/...
const planRoutes = require("./routes/plan");
app.use("/plan", planRoutes);

const rlRoutes=require("./routes/rl");
app.use("/rl",rlRoutes);

app.use((error,req,res,next) => {
    return res.status(500).json({ error: error.toString() });
});

//pokrecemo celu stvar, da slusa na portu 8000
app.listen(8000, async function(){
    mongoose.connect(MONGO_CONNECTION_STRING);
    console.log("API server je pokrenut na portu 8000");
});
