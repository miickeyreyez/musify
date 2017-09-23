import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {UploadService} from '../services/upload.service';
import {GLOBAL} from '../services/global';
import {Artist} from '../models/artist';

@Component(
{
	selector:'artist-edit',
	templateUrl:'../views/artist-add.html',
	providers:[UserService,ArtistService,UploadService]
})

export class ArtistEditComponent implements OnInit
{
	public titulo:string;
	public artist:Artist;
	public identity;
	public token;
	public url:string;
	public user;
	public alertMessage;
	public isEdit;
	public filesToUpload:Array<File>;

	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _artistService:ArtistService, private _uploadService:UploadService)
	{
		this.titulo = 'Editar artista';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.user = JSON.parse(this.identity);
	    this.artist = new Artist('','','');
	    this.isEdit = true;
	}

	ngOnInit()
	{
		console.log('Componente artist-detail.component.ts cargado');
		//Llamar al método del API para obtener artista
		this.getArtist();
	}

	onSubmit()
	{
		this._artistService.editArtist(this.token,this.getId(),this.artist).subscribe(
			response => 
			{			

				if(!response.artist)
				{
					this.alertMessage = 'Error al editar artista';
				}
				
				else
				{
					//this.artist = response.artist;
					//this._router.navigate(['/edit-artist'],response.artist._id);
					this.alertMessage = 'Artista actualizado correctamente';
					if(!this.filesToUpload)
					{
						this._router.navigate(['/artist-detail',this.getId()]);
					}
					else
					{
						//Subir la imagen del artista
						this._uploadService.makeFileRequest(this.url + 'upload_image_artist/' + this.getId(), [], this.filesToUpload, this.token, 'image').then(
							(result) => 
							{
								this._router.navigate(['/artist-edit',this.getId()]);
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