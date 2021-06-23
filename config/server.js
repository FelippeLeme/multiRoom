/* importar express */
var express = require('express');

/*importar consign */
var consign = require('consign');

/*importar bodyParser */var bodyParser = require('body-parser');

/*importar express validator */
var expressValidator = require('express-validator');

/*iniciar objeto do express */
 var app = express();

 /*setar as variaveis de view engine  e views do express*/
 app.set('view engine', 'ejs');
 app.set('views', './app/views');

 /*configurar o middleware express.static */
 app.use(express.static('./app/public'));

 /*configurar bodyparser*/
 app.use(bodyParser.urlencoded({extended:true}));

 /*configurar express validator*/
 app.use(expressValidator());

 /*efetua o autoload das rotas, dos models e dos controllers para o app */
 consign()
    .include('app/routes')
    .then('app/models')
    .then('app/controllers')
    .into(app);


/*exportar o objeto express */
module.exports = app;