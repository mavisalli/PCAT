const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {

  const page = req.query.page || 1;
  const photosPerPage = 2;

  const totalPhotos = await Photo.find().countDocuments();
  const photos = await Photo.find({})
  .sort("-dateCreated") // fotografları tarihe göre sıralıyoruz
  .skip((page-1) * photosPerPage) // kac tane fotografı pas gececegimizi belirliyoruz.
  .limit(photosPerPage) // her sayfada kac tane gösterilcegini belirliyoruz.
  res.render("index", {
    photos: photos,
    current: page, // o andaki sayfaya karsılık gelir
    pages : Math.ceil(totalPhotos / photosPerPage)
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + "/../public/uploads/" + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadeImage.name,
    });
    res.redirect("/");
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + "/../public" + photo.image; //photo.image demek "/uploads/about-3.jpg" demek
  fs.unlinkSync(deletedImage); // senkron olarak önce uplaods icindeki dosyayı siliyoruz.
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
};
