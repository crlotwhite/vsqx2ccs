const express = require('express');
const router = express.Router();
const multer = require('multer');
const {XML2JSON, getDownloadFilename} = require("../utils");
const {fromVSQX} = require("../ccs/fromVSQX");
const {toCCS} = require("../ccs/toCCS");
const fs = require("fs");
const mime = require("mime");



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    },
});
const upload = multer({storage: storage});

router.post('/', upload.single('vocal_sequence_file'), function (req, res) {

    let isHiragana = req.body.is_hiragana === "1";
    let fileName = req.file.filename;
    let vsqXML = XML2JSON(`uploads/${fileName}`);
    let result = fromVSQX(vsqXML, isHiragana);
    let cssObject = toCCS(result);

    // obj to file
    let ccsFileName = fileName.split('.')[0] + ".ccs";
    console.log(`ccs name is ${ccsFileName}`);
    fs.writeFile(`uploads/${ccsFileName}`, cssObject, function (err){
        if (err) throw err;
        console.log('It\'s saved!');
    });

    let mimetype = mime.getType(`uploads/${ccsFileName}`);
    res.setHeader('Content-disposition', 'attachment; filename=' + getDownloadFilename(req, ccsFileName));
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(`uploads/${ccsFileName}`);
    filestream.pipe(res);
    fs.unlink(`uploads/${fileName}`, (err) => err ? console.log(err) : console.log(`${fileName} 를 정상적으로 삭제했습니다`));
    fs.unlink(`uploads/${ccsFileName}`, (err) => err ? console.log(err) : console.log(`${ccsFileName} 를 정상적으로 삭제했습니다`));

});

module.exports = router;
