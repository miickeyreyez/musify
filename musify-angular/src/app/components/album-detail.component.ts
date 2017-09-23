import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.service';
import {SongService} from '../services/song.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {Song} from '../models/song';
import swal from 'sweetalert';

@Component(
{
	selector:'album-detail',
	templateUrl:'../views/album-detail.html',
	providers:[UserService,AlbumService,SongService]
})

export class AlbumDetailComponent implements OnInit
{
	public title:string;
	public artist:Artist;
	public albums:Album[];
	public album:Album;
	public songs:Song[];
	public identity;
	public token;
	public url:string;
	public user;
	public alertMessage;
	public isEdit;

	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _albumService:AlbumService, private _songService:SongService)
	{
		this.title = 'Detalle del álbum';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.user = JSON.parse(this.identity);
	    this.isEdit = true;
	}

	ngOnInit()
	{
		console.log('Componente album-detail.component.ts cargado');
		//Llamar al método del API para obtener album
		this.getAlbumSongs();
	}

	getAlbumSongs()
	{
		this._route.params.forEach((params: Params) =>
		{
			let id = params['id'];
			this._albumService.getAlbum(id).subscribe(
				response =>
				{
					if(!response.album)
					{
						this._router.navigate(['/']);
					}
					else
					{
						this.album = response.album;
						//Obtener canciones del artista
						this._songService.getSongs(response.album._id).subscribe(
							response =>
							{
								console.log(response.songs.length);
								if(response.songs.length == 0)
								{
									//this._router.navigate(['/']);
									this.alertMessage = 'El álbum aún no tiene canciones';
								}
								else
								{
									this.songs = response.songs;
									console.log(this.songs);
								}
							},
							error =>
							{
								var errorMessage = <any>error;
					            if(errorMessage != null)
					            {
					        	    //Parseo de respuesta
					                var body = JSON.parse(error._body);
					                this.alertMessage = body.message; //Si mando el error me imprime el error
					                console.log("Error: " + error);
					            }
							}
						);
					}
				},
				error =>
				{
					var errorMessage = <any>error;
		            if(errorMessage != null)
		            {
		        	    //Parseo de respuesta
		                var body = JSON.parse(error._body);
		                this.alertMessage = body.message; //Si mando el error me imprime el error
		                console.log("Error: " + error);
		            }
				}
			);
		});
	}

	borrarCancion(id)
	{
		swal({
  			title: "Eliminar :(",
  			text: "¿Desea eliminar la canción?",
  			icon: "warning",
  			buttons: ["Cancelar", "Borrar"],
  			dangerMode: true,
		}).then((willDelete) => 
		{
  			if (willDelete) 
  			{
  				this._songService.deleteSong(id).subscribe(
					response =>
					{
						if(!response.song)
						{
							swal("Error al eliminar canción, intente nuevamente.", 
			    			{
			      				icon: "error", 
			    			});
						}
						else
						{
							swal("Canción eliminada satisfactoriamente.", 
			    			{
			      				icon: "success", 
			    			});
							this.getAlbumSongs();
						}
					},
					error =>
					{
						/*var errorMessage = <any>error;
				        if(errorMessage != null)
				    	{
				            //Parseo de respuesta
				            var body = JSON.parse(error._body);
				            this.alertMessage = body.message; //Si mando el error me imprime el error
				            console.log("Error: " + error);
				        }*/
				        swal("Error al eliminar canción, intente nuevamente.", 
			    			{
			      				icon: "error", 
			    			});
					}
				);
  			}
  			else 
  			{
    			swal("¡La canción no se eliminó! :D"); 
  			}
		});
	}

	onPlay(song)
	{
		let songPlayer = JSON.stringify(song);
		let filePath = this.url + 'get_song/' + song.file;
		let imagePath = this.url + 'get_image_album/' + song.album.image;
		//Guardar canción en el localStorage
		localStorage.setItem('songPlaying',songPlayer);
		//Actualizar el elemento
		document.getElementById('mp3-source').setAttribute("src",filePath);
		//Cargar la canción con JavaScript 
		//Forzar el dato a ser tipo any
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();
		document.getElementById('play-song-title').innerHTML = song.name + ' - ' + song.album.artist.name;
		document.getElementById('play-image-album').setAttribute('src',imagePath);
		console.log(imagePath);
	}
}