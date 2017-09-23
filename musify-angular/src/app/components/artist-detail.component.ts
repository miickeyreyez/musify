import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import swal from 'sweetalert';

@Component(
{
	selector:'artist-detail',
	templateUrl:'../views/artist-detail.html',
	providers:[UserService,ArtistService,AlbumService]
})

export class ArtistDetailComponent implements OnInit
{
	public titulo:string;
	public artist:Artist;
	public albums:Album[];
	public identity;
	public token;
	public url:string;
	public user;
	public alertMessage;
	public isEdit;

	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _artistService:ArtistService,private _albumService:AlbumService)
	{
		this.titulo = 'Detalles del artista';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.user = JSON.parse(this.identity);
	    this.isEdit = true;
	}

	ngOnInit()
	{
		console.log('Componente artist-edit.component.ts cargado');
		//Llamar al método del API para obtener artista
		this.getArtist();
	}

	getArtist()
	{
		this._route.params.forEach((params: Params) =>
		{
			let id = params['id'];
			this._artistService.getArtist(this.token,id).subscribe(
				response =>
				{
					if(!response.artist)
					{
						this._router.navigate(['/']);
					}
					else
					{
						this.artist = response.artist;
						//Obtener albúms del artista
						this._albumService.getAlbums(response.artist._id).subscribe(
							response =>
							{
								if(!response.albums)
								{
									//this._router.navigate(['/']);
									this.alertMessage = 'El artista aún no tiene álbums';
								}
								else
								{
									this.albums = response.albums;
									console.log(this.albums);
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

	borrarAlbum(id)
	{
		swal({
  			title: "Eliminar :(",
  			text: "¿Desea eliminar el álbum?",
  			icon: "warning",
  			buttons: ["Cancelar", "Borrar"],
  			dangerMode: true,
		}).then((willDelete) => 
		{
  			if (willDelete) 
  			{
  				this._albumService.deleteAlbum(id).subscribe(
					response =>
					{
						if(!response.album)
						{
							swal("Error al eliminar álbum, intente nuevamente.", 
			    			{
			      				icon: "error", 
			    			});
						}
						else
						{
							swal("Álbum eliminado satisfactoriamente.", 
			    			{
			      				icon: "success", 
			    			});
							this.getArtist();
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
				        swal("Error al eliminar álbum, intente nuevamente.", 
			    			{
			      				icon: "error", 
			    			});
					}
				);
  			}
  			else 
  			{
    			swal("¡El álbum no se eliminó! :D"); 
  			}
		});
	}

}