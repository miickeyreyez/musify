import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {SongService} from '../services/song.service';
import {UploadService} from '../services/upload.service';
import {GLOBAL} from '../services/global';
import {Song} from '../models/song';

@Component(
{
	selector:'song-edit',
	templateUrl:'../views/song-add.html',
	providers:[UserService,SongService,UploadService]
})

export class SongEditComponent implements OnInit
{
	public title:string;
	public identity;
	public token;
	public song:Song;
	public url:string;
	public alertMessage;
	public user;
	public isEdit;
	public filesToUpload:Array<File>; 

	
	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _songService:SongService, private _uploadService:UploadService)
	{
		this.title = 'Editar canción';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.song = new Song('',1,'','','');
	    this.user = JSON.parse(this.identity);
	    this.isEdit = true;
	    console.log(this.token);
	}

	ngOnInit()
	{
		console.log('Componente song-edit.component.ts cargado');
		//Obtener la canción a editar
		this.getSong();
		console.log(this.getSong());
	}

	onSubmit()
	{
		this._route.params.forEach((params:Params)=>
		{	
			let id = params['id'];
			this.song.album = '597d4cc4c1d1fb54cb184788'; //id;
			console.log(this.song);
			this._songService.editSong(id,this.song).subscribe(
				response => 
				{			

					if(!response.song)
					{
						this.alertMessage = 'Error al crear canción';
					}
					
					else
					{
						console.log(response.song);
						this.alertMessage = 'Canción actualizada exitosamente';
						//this._router.navigate(['/song-edit',response.song._id]);
						//Subir el fichero de audio
						if(this.filesToUpload)
						{
							//Subir el archivo
							this._uploadService.makeFileRequest(this.url + 'upload_song/' + this.getId(), [], this.filesToUpload, this.token, 'file').then(
								(result) => 
								{
									this._router.navigate(['/song-edit',this.getId()]);
								},
								(error) =>
								{
									console.log(error);
								}
							);
						}
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

	getSong()
	{
		this._songService.getSong(this.getId()).subscribe(
			response => 
			{			

				if(!response.song)
				{
					this.alertMessage = 'Error al obtenerar canción';
				}
				else
				{
					this.song = response.song;
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

	getId()
	{
		let id;
		this._route.params.forEach((params: Params) =>
		{
			id = params['id'];
		});
		return id;
	}

	fileChangeEvent(fileInput:any)
	{
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log("Ficheros seleccionados:");
		console.log(this.filesToUpload);
	}
}