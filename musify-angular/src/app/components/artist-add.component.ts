import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';

@Component(
{
	selector:'artist-add',
	templateUrl:'../views/artist-add.html',
	providers:[UserService,ArtistService]
})

export class ArtistAddComponent implements OnInit
{
	public titulo:string;
	public artist:Artist;
	public identity;
	public token;
	public url:string;
	public user;
	public alertMessage;

	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _artistService:ArtistService)
	{
		this.titulo = 'Añadir nuevo artista';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.user = JSON.parse(this.identity);
	    this.artist = new Artist('','','');
	}

	ngOnInit()
	{
		console.log('Componente artist-add.component.ts cargado');
		//Conseguir el listado de artistas
	}

	onSubmit()
	{
		this._artistService.addArtist(this.token,this.artist).subscribe(
			response => 
			{			

				if(!response.artist)
				{
					this.alertMessage = 'Error al crear artista';
				}
				
				else
				{
					this.artist = response.artist;
					this.alertMessage = 'Artista guardado exitosamente';
					this._router.navigate(['/artist-edit',response.artist._id]);
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