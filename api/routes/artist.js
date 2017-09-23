'use strict'
var express = require('express');
var artistController = require('../controllers/artist');
var multipart = require('connect-multiparty');
var md_auth = require('../middleware/authenticated');
var md_upload = multipart({uploadDir:'./uploads/artists'});
var api = express.Router();

api.post('/artist',md_auth.ensureAuth,artistController.saveArtist);
api.get('/artist/:id',md_auth.ensureAuth,artistController.getArtist);
api.get('/artists/:page?',md_auth.ensureAuth,artistController.getArtists);
api.put('/artist/:id',md_auth.ensureAuth,artistController.updateArtist);
api.delete('/artist/:id',md_auth.ensureAuth,artistController.deleteArtist);
api.post('/upload_image_artist/:id', [md_auth.ensureAuth, md_upload], artistController.uploadImage);
api.get('/get_image_artist/:imageFile', artistController.getImageFile);

module.exports = api;