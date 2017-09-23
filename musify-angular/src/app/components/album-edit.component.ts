import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.service';
import {UploadService} from '../services/upload.service';
import {GLOBAL} from '../services/global';
import {Album} from '../models/album';

@Component(
{
	selector:'album-edit',
	templateUrl:'../views/album-add.html',
	providers:[UserService,UploadService,AlbumService]
})

export class AlbumEditComponent implements OnInit
{
	public title:string;
	public album:Album;
	public identity;
	public token;
	public url:string;
	public user;
	public alertMessage;
	public isEdit;
	public filesToUpload:Array<File>;

	constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService, private _uploadService:UploadService, private _albumService:AlbumService)
	{
		this.title = 'Editar álbum';
		this.identity = localStorage.getItem('identity');
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	    this.user = JSON.parse(this.identity);
	    //this.album = new Album('','',2017,'','');
	    this.isEdit = true;
	}

	ngOnInit()
	{
		console.log('Componente album-edit.component.ts cargado');
		//Llamar al método del API para obtener álbum
		this.getAlbum();
	}

	onSubmit()
	{
		this._route.params.forEach((params:Params)=>
		{
			let id = params['id'];
			this._albumService.editAlbum(id,this.album).subscribe(
				response => 
				{			

					if(!response.album)
					{
						this.alertMessage = 'Error al editar álbum';
					}
					
					else
					{
						this.album = response.album;
						//this._router.navigate(['/edit-artist'],response.artist._id);
						this.alertMessage = 'Álbum actualizado correctamente';
						if(this.filesToUpload)
						{
							//Subir la imagen del álbum
							this._uploadService.makeFileRequest(this.url + 'upload_image_album/' + this.getId(), [], this.filesToUpload, this.token, 'image').then(
								(result) => 
								{
									this._router.navigate(['/album-edit',this.getId()]);
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

	getAlbum()
	{
		this._route.params.forEach((params:Params)=>
		{
			let id = params['id'];
			this._albumService.getAlbum(id).subscribe(
				response =>
				{
					if(!response.album)
					{
						//this.alertMessage = 'Error al obtener álbum';
						this._router.navigate(['/']);
					}
					else
					{
						this.album = response.album;
						console.log(this.album);
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