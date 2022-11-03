const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require("fs");
var pdf = require("pdf-creator-node");


const app = express();

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;"></div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: '1',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    },
    childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
    }
};



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
    var html = req.body.html;
    var path = './file/' + id.trim() + '.pdf';
    var document = {
        html: html,
        data: {
            //users: users,
        },
        path: path,
        type: "",
    }; 
    
    
    const doc =  await pdf.create(document, options);
    var data = fs.readFileSync(path, {encoding: 'base64'});
    fs.unlinkSync(path)
    res.send({'data' : data});

  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log("Server Running");
});