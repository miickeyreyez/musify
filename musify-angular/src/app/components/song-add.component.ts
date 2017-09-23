import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {SongService} from '../services/song.service';
import {GLOBAL} from '../services/global';
import {Song} from '../models/song';

@Component(
{
	selector:'song-add',
	templateUrl:'../views/song-add.html',
	providers:[UserService,SongService]
})

export class SongAddComponent implements OnInit
{
	public title:string;
	public identity;
	public token;
	public song:Song;
	public url:string;
	public alertMessage;
	public user;
	
	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _songService:SongService)
	{
		this.title = 'Añadir canción';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.song = new Song('',1,'','','');
	    this.user = JSON.parse(this.identity);
	}

	ngOnInit()
	{
		console.log('Componente song-add.component.ts cargado');
		console.log(this.identity);
		console.log(this.user);
	}

	onSubmit()
	{
		console.log(this._route.params);
		this._route.params.forEach((params:Params)=>
		{	
			let id = params['id'];
			this.song.album = id;
			console.log(this.song);
		});
		this._songService.addSong(this.song).subscribe(
			response => 
			{			

				if(!response.song)
				{
					this.alertMessage = 'Error al crear canción';
				}
				
				else
				{
					console.log(response);
					this.song = response.song;
					this.alertMessage = 'Canción guardada exitosamente';
					this._router.navigate(['/song-edit',response.song._id]);
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