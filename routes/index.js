var express = require('express');
var router = express.Router();
var fs = require('file-system');

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile(__dirname + '/index.html');
});

function saveFile(url, body) {
  fs.writeFile(url, body, (err) => {
    if (err) {
      console.log('Error saving');
      throw err;
    } else {
      console.log('It\'s saved!');
    }
  });
}

router.post('/api/endpoint', function (request, response) {
  //saveFile(request.query.url, request.body.body);
  response.send('This is a basic Example for Express.js by TUTORIALKART')
});


module.exports = router;
