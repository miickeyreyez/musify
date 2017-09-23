'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveAlbum(req,res)
{
	var album = new Album();
	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;
	album.save((err,albumStored) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al guardar álbum'});
		}
		else
		{
			if(!albumStored)
			{
				res.status(404).send({message:'El álbum no ha sido guardado'});
			}
			else
			{
				res.status(200).send({album:albumStored});
			}
		}
	});
}

function getAlbum(req,res)
{
	var albumId = req.params.id;
	Album.findById(albumId).populate({path:'artist'}).exec((err,album) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener datos del artista del álbum'});
		}
		else
		{
			if(!album)
			{
				res.status(404).send({message:'El álbum no existe'});
			}
			else
			{
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req,res)
{
	var artistId = req.params.artist;
	//Sacar todos los álbums de la base de datos
	var find = Album.find({}).sort('title');
	console.log(artistId);
	if(artistId)
	{
		//Sacar los álbums del artista que se desea consultar
		find = Album.find({artist:artistId}).sort('year');
	}
	find.populate({path:'artist'}).exec((err,albums) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener albums'});	
		}
		else
		{
			if(!albums)
			{
				res.status(404).send({message:'No hay albums'});
			}
			else
			{
				res.status(200).send({albums});
			}
		}
	});
}

function updateAlbum(req,res)
{
	var albumId = req.params.id;
	var update = req.body;
	Album.findByIdAndUpdate(albumId,update,(err, albumUpdated) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al actualizar álbum'});	
		}
		else
		{
			if(!albumUpdated)
			{
				res.status(404).send({message:'El álbum no ha sido actualizado'});
			}
			else
			{
				res.status(200).send({album:albumUpdated});
			}
		}
	});
}

function deleteAlbum(req,res)
{
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId,(err,albumRemoved) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al eliminar álbum'});	
		}
		else
		{
			if(!albumRemoved)
			{
				res.status(404).send({message:'El álbum no ha sido eliminado'});
			}
			else
			{
				console.log(albumRemoved);
				Song.find({album:albumRemoved._id}).remove((err,songRemoved) =>
				{
					if(err)
					{
						res.status(500).send({message:'Error al eliminar canción del álbum del artista'});	
					}
					else
					{
						if(!songRemoved)
						{
							res.status(404).send({message:'La canción no ha sido eliminada'});
						}
						else
						{
							res.status(200).send({album:albumRemoved});
						}
					}
				});	
			}
		}
	});
}

function uploadImage(req,res)
{
	var albumId = req.params.id;
	var file_name = 'No existe imagen asociada al álbum';
	if(req.files)
	{
		var file_path = req.files.image.path; //Fichero a subir
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
			Album.findByIdAndUpdate(albumId,{image:file_name},(err,albumUpdated) =>
			{
				if(err)
				{
					res.status(500).send({message:'Error al actualizar el álbum'});
				}
				else
				{
					if(!albumUpdated)
					{
						res.status(404).send({message:'Error al actualizar álbum'});
					}
					else
					{
						res.status(200).send({albumUpdated});
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
	var path_file = './uploads/albums/'+imageFile;
	fs.exists(path_file,function(exists)
	{
		if(exists)
		{
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
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}