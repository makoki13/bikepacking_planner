var express = require('express');
var router = express.Router();
var fs = require('file-system');

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile(__dirname + '/index.html');
});

function guarda_fichero(url, body) {
  fs.writeFile("tours/" + url, body, (err) => {
    if (err) {
      console.log('Error saving');
      throw err;
    } else {
      console.log('It\'s saved!');
    }
  });
}

router.post('/api/endpoint', function (request, response) {
  //console.log('request', request, 'response', response);
  guarda_fichero(request.body.nombre_tour, request.body.texto);
  response.send('ok')
});


module.exports = router;
