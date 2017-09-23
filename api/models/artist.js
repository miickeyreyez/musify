'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema; //Objeto del tipo schema
var artistSchema = schema({
	name:String,
	description:String,
	image:String
});

module.exports = mongoose.model('Artist',artistSchema);