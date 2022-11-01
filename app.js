const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require("fs");
const { convertFile}  = require('convert-svg-to-png');
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './file')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

app.use(multer({ storage: fileStorage }).any('files'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,skip, Content-Length, X-Requested-With');
    next();
});

app.post('/convert', async(req, res) => {
    var id = Date.now().toString();
    var datos = fs.writeFileSync('./file/' + id.trim() + '.svg', req.body.svg);
    const outputFilePath = await convertFile('./file/' + id.trim() + '.svg');

    var datosImg = fs.readFileSync('./file/'+id.trim()+'.png');
    fs.unlinkSync('./file/'+id.trim()+'.png');
    fs.unlinkSync('./file/'+id.trim()+'.svg');
    res.send({'data':datosImg});

  });

const PORT = process.env.PORT || 5001;
app.listen(process.env.PORT || 5000);