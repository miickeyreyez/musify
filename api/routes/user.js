'use strict'

var express = require('express');
var userController = require('../controllers/user');
//Herramienta para subir ficheros
var multipart = require('connect-multiparty');
//Middleware de autenticación
var md_auth = require('../middleware/authenticated');
//Directorio de subida de ficheros
var md_upload = multipart({uploadDir:'./uploads/users'});
//Router de express
var api = express.Router();

//Métodos get, post, put
api.get('/testController', userController.pruebas);
api.post('/login', userController.loginUser);
api.post('/register', userController.saveUser);
//Si el parámetro es necesario :id si es opcional id?
api.get('/users/:id?',md_auth.ensureAuth,userController.getUsers);
api.put('/update_user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload_image_user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get_image_user/:imageFile', userController.getImageFile);

module.exports = api;