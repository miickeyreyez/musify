'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret  = 'secretPassword';

exports.ensureAuth = function(req, res, next)
{
	if(!req.headers.authorization)
	{
		return res.status(403).send({message:'La petición no tiene cabeceras de autenticación'});
	}
	//Se quitan las comillas porque puede venir el token con comillas
	var token = req.headers.authorization.replace(/['"]+/g,'');
	try
	{
		//Obtener el usuario, a partir del token que llega en la petición
		var payload = jwt.decode(token,secret);
		//Si ya expiró el token
		if(payload.exp <= moment.unix())
		{
			return res.status(401).send({message:'El token ha expirado'});
		}
	}
	catch(ex)
	{
		console.log(ex);
		return res.status(404).send({message:'Token no válido'});
	}
	req.user = payload;
	next();
}