'use strict'

var fs = require('fs');
var path = require('path');
//Importar el modelo
var User = require('../models/user');
//Módulo para cifrar contraseñas
var bcrypt = require('bcrypt-nodejs');
//Token de autenticación
var jwt = require('../services/jwt');

function pruebas(req,res)
{
	res.status(200).send({message: 'Controlador de usuario'});
}

function loginUser(req,res)
{
	console.log(params);
	var params = req.body;
	var email = params.email;
	var password = params.password;
	//Encontrar al usuario
	User.findOne({email:email.toLowerCase()},(err,user) => 
	{
		if(err)
		{
			res.status(500).send({message:'Error en la petición'});
		}
		else
		{
			if(!user)
			{
				res.status(404).send({message:'El usuario no existe'});
			}
			else
			{
				//Comprobar la contraseña
				bcrypt.compare(password,user.password,function(err,check)
				{
					if(check)
					{
						//Devolver los datos del usuario
						if(params.gethash)
						{
							//Generar un token JWT
							res.status(200).send({token:jwt.createToken(user)});
						}
						else
						{
							//Devolver el usuario
							res.status(202).send({user});
						}
					}
					else
					{
						res.status(404).send({message:'Contraseña incorrecta'});
					}
				});
			}
		}
	});
}

function saveUser(req,res)
{
	var user = new User();
	var params = req.body;

	console.log(params);
	
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	if(params.password)
	{
		//Cifrar contraseña
		bcrypt.hash(params.password,null,null,function(err,hash)
		{
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null)
			{
				//Guardar el usuario en base de datos
				user.save((err,userStored) => {
					if(err)
					{
						res.status(500).send({message:'Error al guardar el usuario'});
					}
					else
					{
						if(!userStored)
						{
							res.status(404).send({message:'No se ha registrado el usuario'});
						}
						else
						{
							res.status(200).send({user:userStored});	
						}
					}
				});
			}
			else
			{
				res.status(500).send({message:'Introduce los datos necesarios para el registro'});
			}
		});
	}
	else
	{
		res.status(500).send({message:'Introduce la contraseña'});
	}
}

function getUsers(req,res)
{
	User.find({},(err,users) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener usuarios'});	
		}
		else
		{
			if(!users)
			{
				res.status(404).send({message:'No hay usuarios'});
			}
			else
			{
				res.status(200).send({users:users});
			}
		}
	});
}

function updateUser(req,res)
{
	var userId = req.params.id;
	var update = req.body;

	console.log(userId);
	console.log(req.user.id);
	//Validar que el usuario puede modificar su propio usuario
	if(userId != req.user.sub)
	{
		return res.status(500).send({message:'Estás tratando de actualizar un usuario que no es el tuyo.'});
	}

	if(req.body.password)
	{
		//Cifrar contraseña
		bcrypt.hash(req.body.password,null,null,function(err,hash)
		{
			console.log(hash);
		});
	}
	
	User.findByIdAndUpdate(userId,update,(err,userUpdated) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al actualizar el usuario'});
		}
		else
		{
			if(!userUpdated)
			{
				res.status(404).send({message:'Error al actualizar usuario'});
			}
			else
			{
				res.status(200).send({userUpdated});
			}
		}
	});
}

function uploadImage(req,res)
{
	var userId = req.params.id;
	var file_name = 'Imagen no subida';
	//Si viene un archivo, esto se identifica con el connect-multiparty
	if(req.files)
	{
		//Fichero a subir
		var file_path = req.files.image.path;
		console.log(file_path);
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		console.log(file_split);
		console.log(file_name);
		console.log(file_name.split('\.'));
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif')
		{
			//Se le pasa el id, y un JSON con la propiedad que se quiere modificar
			User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdated) =>
			{
				if(err)
				{
					res.status(500).send({message:'Error al actualizar el usuario'});
				}
				else
				{
					if(!userUpdated)
					{
						res.status(404).send({message:'Error al actualizar usuario'});
					}
					else
					{
						res.status(200).send({image:file_name,user:userUpdated});
					}
				}
			});
		}
		else
		{
			res.status(200).send({message:'Extensión no valida'});
		}
	}
	else
	{
		res.status(200).send({message:'La imagen no ha sido subida'});
	}
}

function getImageFile(req,res)
{
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;
	//Verificar si existe la imagen
	fs.exists(path_file,function(exists)
	{
		if(exists)
		{
			//Se envía la imagen
			res.sendFile(path.resolve(path_file));
		}
		else
		{
			res.status(200).send({message:'La imagen no ha existe'});
		}
	});
}

module.exports = 
{
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile,
	getUsers
};