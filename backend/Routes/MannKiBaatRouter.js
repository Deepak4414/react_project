const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const audioBasePath = path.join(__dirname, "..", "audioFiles");

// 🔹 GET /api/mannKiBaat/yearList?langCode=hi
router.get("/yearList", (req, res) => {
    const { langCode } = req.query;
    const langPath = path.join(audioBasePath, langCode);
    console.log(langPath);
    if (!fs.existsSync(langPath)) return res.status(404).send("Language not found");

    const years = fs.readdirSync(langPath).filter((folder) =>
        fs.statSync(path.join(langPath, folder)).isDirectory()
    );
    res.json(years);
});

// 🔹 GET /api/mannKiBaat/fileInfo?langCode=hi&year=2023
router.get("/fileInfo", (req, res) => {
    const { langCode, year } = req.query;
    // console.log(langCode, year);
    const folderPath = path.join(audioBasePath, langCode, year);
    if (!fs.existsSync(folderPath)) return res.status(404).send("Files not found");

    const files = fs.readdirSync(folderPath).filter((file) =>
        file.endsWith(".mp3")
    );
    res.json(files);
});

// 🔹 GET /api/mannKiBaat/getMannKiBaat/:lang/:year/:file
router.get("/getMannKiBaat/:lang/:year/:file", (req, res) => {
    const { lang, year, file } = req.params;
    const filePath = path.join(audioBasePath, lang, year, file);
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    res.sendFile(filePath);
});

// 🔹 GET /api/mannKiBaat/playTime/:lang/:year/:month/:seconds
router.get("/playTime/:lang/:year/:month/:seconds", (req, res) => {
    const { lang, year, month, seconds } = req.params;
    console.log(`Played: ${lang}/${year}/${month} for ${seconds}s`);
    res.send("Play time logged");
});

module.exports = router;
