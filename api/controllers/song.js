'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveSong(req,res)
{
	var song = new Song();
	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;
	song.save((err,songStored) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al guardar canción'});
		}
		else
		{
			if(!songStored)
			{
				res.status(404).send({message:'La canción no ha sido guardada'});
			}
			else
			{
				res.status(200).send({song:songStored});
			}
		}
	});
}

function getSong(req,res)
{
	var songId = req.params.id;
	Song.findById(songId).populate({path:'album'}).exec((err,song) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener la canción'});
		}
		else
		{
			if(!song)
			{
				res.status(404).send({message:'La canción no existe'});
			}
			else
			{
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req,res)
{
	/*
	Si se deseara paginar, sería así:
	var page = 1;
	if(req.params.page)
	{
		page = req.params.page;
	}
	//Items por página
	var itemsPerPage = 2;	
	*/
	var albumId = req.params.album;
	//Sacar todos los álbums de la base de datos
	var find = Song.find({}).sort('title');
	if(albumId)
	{
		//Sacar los álbums del artista que se desea consultar
		find = Song.find({album:albumId}).sort('number');
	}
	//find.populate({path:'album',populate:{path:'artist',model:'Artist'}}).paginate(page,itemsPerPage).exec((err,songs) =>
	find.populate({path:'album',populate:{path:'artist',model:'Artist'}}).exec((err,songs) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener canciones'});	
		}
		else
		{
			if(!songs)
			{
				res.status(404).send({message:'No hay canciones'});
			}
			else
			{
				res.status(200).send({songs});
			}
		}
	});
}

function updateSong(req,res)
{
	var songId = req.params.id;
	var update = req.body;
	Song.findByIdAndUpdate(songId,update,(err, songUpdated) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al actualizar canción'});	
		}
		else
		{
			if(!songUpdated)
			{
				res.status(404).send({message:'La canción no ha sido actualizada'});
			}
			else
			{
				res.status(200).send({song:songUpdated});
			}
		}
	});
}

function deleteSong(req,res)
{
	var songId = req.params.id;
	Song.findByIdAndRemove(songId,(err,songRemoved) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al eliminar canción'});	
		}
		else
		{
			if(!songRemoved)
			{
				res.status(404).send({message:'La canción no ha sido eliminada'});
			}
			else
			{
				res.status(200).send({song:songRemoved});	
			}
		}
	});
}

function uploadSong(req,res)
{
	var songId = req.params.id;
	var file_name = 'No existe imagen asociada al álbum';
	if(req.files)
	{
		var file_path = req.files.file.path; //Fichero a subir
		console.log(file_path);
		var file_split = file_path.split('\/');
		var file_name = file_split[2];
		console.log(file_split);
		console.log(file_name);
		console.log(file_name.split('\.'));
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		if(file_ext == 'mp3' || file_ext == 'm4a')
		{
			Song.findByIdAndUpdate(songId,{file:file_name},(err,songUpdated) =>
			{
				if(err)
				{
					res.status(500).send({message:'Error al actualizar la canción'});
				}
				else
				{
					if(!songUpdated)
					{
						res.status(404).send({message:'Error al actualizar canción'});
					}
					else
					{
						res.status(200).send({songUpdated});
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
		res.status(200).send({message:'La canción no ha sido subida'});
	}
}

function getSongFile(req,res)
{
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;
	fs.exists(path_file,function(exists)
	{
		if(exists)
		{
			res.sendFile(path.resolve(path_file));
		}
		else
		{
			res.status(200).send({message:'La canción no ha existe'});
		}
	});
}

module.exports = 
{
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadSong,
	getSongFile
}