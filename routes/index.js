var express = require('express');
var router = express.Router();
var fs = require('file-system');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

function guarda_fichero(url, body) {
  fs.writeFile("public/tours/" + url, body, (err) => {
    if (err) {
      console.log('Error saving');
      throw err;
    } else {
      console.log('It\'s saved!');
    }
  });
}

router.post('/api/endpoint', function (request, response) {
  guarda_fichero(request.body.nombre_tour, request.body.texto);
  response.send('ok')
});

router.post('/api/tours', function (request, response) {
  guarda_fichero('tours.json', request.body.texto);
  response.send('ok')
});


module.exports = router;
