'use strict'
var express = require('express');
var albumController = require('../controllers/album');
var multipart = require('connect-multiparty');
var md_auth = require('../middleware/authenticated');
var md_upload = multipart({uploadDir:'./uploads/albums'});
var api = express.Router();

api.post('/album',md_auth.ensureAuth,albumController.saveAlbum);
api.get('/album/:id',md_auth.ensureAuth,albumController.getAlbum);
api.get('/albums/:artist?',md_auth.ensureAuth,albumController.getAlbums);
api.put('/album/:id',md_auth.ensureAuth,albumController.updateAlbum);
api.delete('/album/:id',md_auth.ensureAuth,albumController.deleteAlbum);
api.post('/upload_image_album/:id', [md_auth.ensureAuth, md_upload], albumController.uploadImage);
api.get('/get_image_album/:imageFile', albumController.getImageFile);

module.exports = api;