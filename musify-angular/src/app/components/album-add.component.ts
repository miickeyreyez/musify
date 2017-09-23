import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.service';
import {GLOBAL} from '../services/global';
import {Album} from '../models/album';
import {Artist} from '../models/artist';

@Component(
{
	selector:'album-add',
	templateUrl:'../views/album-add.html',
	providers:[UserService,ArtistService,AlbumService]
})

export class AlbumAddComponent implements OnInit
{
	public title:string;
	public artist:Artist;
	public album:Album;
	public identity;
	public token;
	public url:string;
	public alertMessage;
	
	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _artistService:ArtistService,private _albumService:AlbumService)
	{
		this.title = 'Añadir álbum';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.album = new Album('','',2017,'','');
	}

	ngOnInit()
	{
		console.log('Componente album-add.component.ts cargado');
	}

	onSubmit()
	{
		this._route.params.forEach((params:Params)=>
		{
			let artist_id = params['id'];
			this.album.artist = artist_id;
		});
		this._albumService.addAlbum(this.album).subscribe(
			response => 
			{			

				if(!response.album)
				{
					this.alertMessage = 'Error al crear álbum';
				}
				
				else
				{
					console.log(response);
					this.artist = response.artist;
					this.alertMessage = 'Álbum guardado exitosamente';
					this._router.navigate(['/album-edit',response.album._id]);
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
}