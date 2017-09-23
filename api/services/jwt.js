'use strict'

var jwt = require('jwt-simple');
//Sirve para fijar vigencia de expiración
var moment = require('moment');
var secret  = 'secretPassword';

//Función que crea un token con base al usuario
//Contiene todos los datos del usuario codificaos
exports.createToken = function(user)
{
	var payLoad = 
	{
		//id del registro en base de datos
		sub:user._id,
		name:user.name,
		surname:user.surname,
		email:user.email,
		role:user.role,
		image:user.image,
		iat:moment().unix(), //Fecha actual
		exp:moment().add(30,'days').unix() //Fecha de expiración
	};

	return jwt.encode(payLoad,secret);
}