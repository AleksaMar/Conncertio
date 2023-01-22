//web server
const express = require("express");
const app = express();

//middleware koji automatski prepakuje JSON podatke iz requesta u objekat (radi json.parse() tamo gde treba)
const bodyParser = require("body-parser");
app.use(bodyParser.json())

//middleware koji nam omogucava da /public folder bude javno dostupan, da ne moramo da pisemo rute koje ce da serviraju fajlove unutar ovog folera
//ovo moze da nam bude zgodno za slike, ako budemo cuvali slike. mada bi bilo pametno da nahvatamo neki storage server u tom slucaju, tipa dropbox
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))

//konekcija za mongo
const mongoose = require("mongoose");
//mongo string, string je generisan u atlasu, na overview pa desno ima connect
const MONGO_CONNECTION_STRING = "mongodb+srv://admin:LrT5ANbZCuT6AmB2@conncertio.ogxryb2.mongodb.net/?retryWrites=true&w=majority";

//modele ucitavamo tamo gde nam trebaju u rutama, ne treba nam ovde

//rute

//home ruta: http://localhost:8000/
app.get("/", (req, res)=>{
    res.send("Pozdrav sa servera!");
});

//ruta: http://localhost:8000/a
app.get("/a", (req, res)=>{
    res.sendFile('/app/public/index1.html');
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

app.use((error,req,res,next) => {
    return res.status(500).json({ error: error.toString() });
});

//pokrecemo celu stvar, da slusa na portu 8000
app.listen(8000, async function(){
    mongoose.connect(MONGO_CONNECTION_STRING);
    console.log("API server je pokrenut na portu 8000");
});
