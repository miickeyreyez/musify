	import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';
import swal from 'sweetalert';

@Component(
{
	selector:'artist-list',
	templateUrl:'../views/artist-list.html',
	providers:[UserService,ArtistService]
})

export class ArtistListComponent implements OnInit
{
	public titulo: string;
	public artists:Artist[];
	public identity;
	public token;
	public url:string;
	public user;
	public nextPage;
	public prevPage;
	public alertMessage;
	public confirmado;

	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _artistService:ArtistService)
	{
		this.titulo = 'Artistas';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.user = JSON.parse(this.identity);
	    this.prevPage = 1;
	    this.nextPage = 1;
	}

	ngOnInit()
	{
		console.log('Componente artist-list.component.ts cargado');
		//Conseguir el listado de artistas
		console.log(this.token);
		this.getArtists();
	}

	getArtists()
	{
		this._route.params.forEach((params:Params) =>
		{
			//Convertimos el parámetro de la página a número con el +
			let page = +params['page'];
			
			if(!page)
			{
				page = 1;
			}
			
			else
			{
				this.nextPage = page + 1;
				this.prevPage = page - 1;

				if(this.prevPage == 0)
				{
					this.prevPage = 1;
				}
			}

			this._artistService.getArtists(this.token,page).subscribe(
				response =>
				{
					if(!response.artists)
					{
						this._router.navigate(['/']);
					}
					else
					{
						this.artists = response.artists;
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

	onDeleteConfirm(id)
	{
		this.confirmado = id;	
	}

	onCancelArtist()
	{
		this.confirmado = null;
	}

	onDeleteArtist(id)
	{
		this._artistService.deleteArtist(this.token,id).subscribe(
			response =>
			{
					if(!response.artist)
					{
						alert('Error en el servidor, intenta nuevamente');
					}
					else
					{
						this.getArtists();
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

	borrarArtista(id)
	{
		swal({
  			title: "Eliminar :(",
  			text: "¿Desea eliminar el artista?",
  			icon: "warning",
  			buttons: ["Cancelar", "Borrar"],
  			dangerMode: true,
		}).then((willDelete) => 
		{
  			if (willDelete) 
  			{
  				this._artistService.deleteArtist(this.token,id).subscribe(
					response =>
					{
						if(!response.artist)
						{
							swal("Error al eliminar artista, intente nuevamente.", 
			    			{
			      				icon: "error", 
			    			});
						}
						else
						{
							swal("Artista eliminado satisfactoriamente.", 
			    			{
			      				icon: "success", 
			    			});
							this.getArtists();
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
				        swal("Error al eliminar artista, intente nuevamente.", 
			    			{
			      				icon: "error", 
			    			});
					}
				);
  			}
  			else 
  			{
    			swal("¡El artista no se eliminó! :D"); 
  			}
		});
	}
}