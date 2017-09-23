'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema; //Objeto del tipo schema
var songSchema = schema({
	number:Number,
	name:String,
	duration:String,
	file:String,
	album:{type:schema.ObjectId,ref:'Album'}
});

module.exports = mongoose.model('Song',songSchema);