'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras HTTO CORS
app.use((req,res,next)=>
{
	//Accesso a nuestra API a todos los dominios
	res.header('Access-Control-Allow-Origin','*');
	//Cabeceras de AJAX
	res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
	//Peticiones HTTP
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
	res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
	next();
});


//rutas base
app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);

app.get('/holaMundo',function(req,res){
	res.status(200).send({message:'holaMundo'});
});
module.exports = app;