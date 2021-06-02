const mongoose = require("mongoose");
const express = require("express");

const ejs = require("ejs");
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const photoController = require("./controllers/photoController");
const pageController = require("./controllers/pageController");

const app = express();

//connect DB
mongoose.connect("mongodb+srv://mavisalli:Kitaptek12@cluster0.k0uno.mongodb.net/pcat-db?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(()=> {
  console.log("DB CONNECTED");
}).catch((err)=> {
  console.log(err);
}) 

//TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload()); 
app.use(methodOverride('_method', {
  methods: ["POST", "GET"]
}));


//ROUTES
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get("/about",pageController.getAboutPage );
app.get("/add", pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);



const port = process.env.PORT || 5000; //heroku ortamı hangi port numarasını isterse buraya verebilsin diye
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
