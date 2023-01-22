Sta je izvrseno u konzoli da bi se dobilo sve ovo:

npm init
npm install mongodb 
npm install nodemon
npm install express

Sta treba da se izvrsi u konzoli da bi projekat radio:
npm install
nodemon app

Koristim nodemon da ne bih morao da stalno restartujem server, nodemon ce da prati promenu u fajlovima i sam se restartuje po potrebi.
Bitno olaksava testiranje i razvoj.

bez-modela.js vam ne treba
app.js je glavni fajl aplikacije, to kad se pokrene startuje web server na portu 8000
u /models sam izdvojio primer definisanja jednog modela, tu cete da trpate redom sve modele koji nam trebaju (dogadjaj, lokacija, user ...)
u /routes sam izdvojio primer grupisanja ruta, tu cete da trpate redom fajlove za sve grupe ruta (/user/... /dogadjaj/... /lokacija/...)
    jer svaki entitet ima tipicno:
        GET /entitet        izlistava sve entitete
        GET /entitet/:id    izlistava entitet sa datim id-em
                                parametar id je spakovan u req.params.id 
        GET /entitet/search vrsi pretragu po parametrima datim u url-u, tipa /entitet/search?ime=Branko
                                parametar ime je spakovan u req.query.ime 
        POST /entitet       kreira novi entitet, podaci su u req.body, salju se kao JSON, bodyparser ih prepakuje i imate gotov objekat
        PUT /entitet/:id    dohvati entitet sa datim id-em, i uradi update. podaci su u body (slicno kao POST)
        DELETE /entitet/:id brise entitet sa datim id-em 

    i verovatno jos kojesta. umesto da u app.js natrpamo 6*n ruta (bice ih 50ak), to lepo grupisemo po fajlovima. 
    primeticete da je logicno da rute jednog entiteta pocinju istim prefiksom. npr:
        /user/12 
        /user/find
        /dogadjaj/find
        /dogadjaj/123
        ...
    grupisanjem u fajlove prefiks cemo da iskoristimo prilikom zadavanja fajla, a onda se unutar fajla gde su rute taj prefiks ne pise jer se podrazumeva (tako je referenciran u app.js)
    imate komentare za ovo tamo gde treba


Za konekciju za mongo - imamo nalog za atlas, leka@gmail, a imamo admin user i pass za bazu - to nije isti nalog.
User za bazu ima privilegije nad bazom. Zove se admin, i u connection stringu imate password.
Ovo je bio jedan od glavnih problema da pokacim sta je sta i povezem se na mongo