'use strict'
var path = require('path');
var fs = require('fs');
//PAginación
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveArtist(req,res)
{
	var artist = new Artist();
	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';
	artist.save((err,artistStored) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al guardar artista'});
		}
		else
		{
			if(!artistStored)
			{
				res.status(404).send({message:'El artista no ha sido guardado'});
			}
			else
			{
				res.status(200).send({artist:artistStored});
			}
		}
	});
}

function getArtist(req,res)
{
	var artistId = req.params.id;
	Artist.findById(artistId,(err,artist) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener artista'});
		}
		else
		{
			if(!artist)
			{
				res.status(404).send({message:'El artista no existe'});
			}
			else
			{
				res.status(200).send({artist});
			}
		}
	});
}

function getArtists(req,res)
{
	var page = 1;
	if(req.params.page)
	{
		page = req.params.page;
	}
	//Items por página
	var itemsPerPage = 5;
	//puede ir function(){} or ()=>{}
	Artist.find().sort('name').paginate(page,itemsPerPage,(err,artists,total) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al obtener artistas'});	
		}
		else
		{
			if(!artists)
			{
				res.status(404).send({message:'No hay artistas'});
			}
			else
			{
				res.status(200).send({totalItems:total,artists:artists});
			}
		}
	});
}

function updateArtist(req,res)
{
	var artistId = req.params.id;
	var update = req.body;
	Artist.findByIdAndUpdate(artistId,update,(err, artistUpdate) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al actualizar artista'});	
		}
		else
		{
			if(!artistUpdate)
			{
				res.status(404).send({message:'El artista no ha sido actualizado'});
			}
			else
			{
				res.status(200).send({artist:artistUpdate});
			}
		}
	});
}

function deleteArtist(req,res)
{
	var artistId = req.params.id;
	Artist.findByIdAndRemove(artistId,(err, artistRemoved) =>
	{
		if(err)
		{
			res.status(500).send({message:'Error al eliminar artista'});	
		}
		else
		{
			if(!artistRemoved)
			{
				res.status(404).send({message:'El artista no ha sido eliminado'});
			}
			else
			{
				console.log(artistRemoved);
				//res.status(200).send({artist:artistRemoved});
				//Cuando se elimina un artista, se tiene que eliminar todo lo asociado
				Album.find({artist:artistRemoved._id}).remove((err,albumRemoved) =>
				{
					if(err)
					{
						res.status(500).send({message:'Error al eliminar álbum del artista'});	
					}
					else
					{
						if(!albumRemoved)
						{
							res.status(404).send({message:'El álbum no ha sido eliminado'});
						}
						else
						{
							//Borrar todas las cancciones del albúm
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
										res.status(200).send({artist:artistRemoved});
									}
								}
							});	
						}
					}
				});
			}
		}
	});
}

function uploadImage(req,res)
{
	var artistId = req.params.id;
	var file_name = 'No existe imagen asociada al artista';
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
			Artist.findByIdAndUpdate(artistId,{image:file_name},(err,artistUpdated) =>
			{
				if(err)
				{
					res.status(500).send({message:'Error al actualizar el artista'});
				}
				else
				{
					if(!artistUpdated)
					{
						res.status(404).send({message:'Error al actualizar artista'});
					}
					else
					{
						res.status(200).send({artistUpdated});
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
	var path_file = './uploads/artists/'+imageFile;
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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}