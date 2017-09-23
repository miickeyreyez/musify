'use strict'
var express = require('express');
var songController = require('../controllers/song');
var multipart = require('connect-multiparty');
var md_auth = require('../middleware/authenticated');
var md_upload = multipart({uploadDir:'./uploads/songs'});
var api = express.Router();

api.post('/song',md_auth.ensureAuth,songController.saveSong);
api.get('/song/:id',md_auth.ensureAuth,songController.getSong);
api.get('/songs/:album?',md_auth.ensureAuth,songController.getSongs);
api.put('/song/:id',md_auth.ensureAuth,songController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth,songController.deleteSong);
api.post('/upload_song/:id', [md_auth.ensureAuth, md_upload], songController.uploadSong);
api.get('/get_song/:songFile', songController.getSongFile);

module.exports = api;