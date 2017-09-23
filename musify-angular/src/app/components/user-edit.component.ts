import {Component,OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {GLOBAL} from '../services/global';

//Indicar que es un componente
@Component
({
	//Dentro de que etiqueta se va a cargar
	selector:'user-edit',
	templateUrl:'../views/user-edit.html',
	providers:[UserService]
})

export class UserEditComponent implements OnInit
{
	//Propiedades del componente
	public titulo:string;
	public user:User;
	public identity;
	public token;
	public alertMessage;
	public name;
	public filesToUpload: Array<File>;
	public url:string;

	constructor(private _userService:UserService)
	{
		this.url = GLOBAL.url;
	}

	ngOnInit()
	{   
	    this.titulo = 'Actualizar datos del usuario';
	    this.identity = this._userService.getIdentity();
	    this.token = this._userService.getToken();
	    this.name = this._userService.getName();
	    let tempUser = localStorage.getItem('identity');
	    this.user = JSON.parse(tempUser);
	    console.log('user-edit.component.ts cargado');
	    console.log('Constructor - userEditComponent');
	    console.log(this.identity);
	    console.log(this.token);
	    console.log(this.name);	   
	}

	onSubmitUpdating()
	{
		this._userService.updateUser(this.user).subscribe
		(
			response =>
			{
				if(!response)
				{
					this.alertMessage = 'Error al actualizar usuario';
				}
				else
				{
					if(!this.filesToUpload)
					{
						//No hay nada que subir
					}
					
					else
					{
						//Debemos subir archivos
						this.makeFileRequest(this.url + 'upload_image_user/' + this.user._id, [], this.filesToUpload).then(
							(result: any) =>
							{
								this.user.image = result.image;
								console.log(this.user.image);
								localStorage.setItem('identity',JSON.stringify(this.user));
								localStorage.setItem('image',this.user.image);
								document.getElementById('avatar-min').setAttribute('src',this.url + 'get_image_user/' + this.user.image);
							}
						);
					}

					//Actualizar el objeto por el que se actualizó (el que se regresa en base de datos)
					//this.user = response.user;
					this.alertMessage = 'usuario actualizado correctamente';
					localStorage.setItem('identity',JSON.stringify(this.user));
					localStorage.setItem('name',this.user.name);
					document.getElementById('botonCerrarSesion').innerHTML = '¡Adiós ' + this.user.name + '!';
					console.log('Usuario actualizado');
					console.log(this.user);
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

	fileChangeEvent(fileInput: any)
	{
		//Recogemos los archivos que se han seleccionado en el input
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>)
	{
		//Petición AJAX para subida de archivos
		var token = this.token;
		//Lanzar el código de subida
		return new Promise(function(resolve, reject)
		{
			//Formulario
			var formData:any = new FormData();
			//Peticiones AJAX
			var xhr = new XMLHttpRequest();

			//Recorrer los ficheros del array
			for(var i = 0; i < files.length; i++)
			{
				formData.append('image',files[i],files[i].name);
			}

			//Comprobar si la petición está lista para lanzarse
			xhr.onreadystatechange = function()
			{
				//Petición 200
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						//Resolvemos
						resolve(JSON.parse(xhr.response));
					}
					else
					{
						reject(xhr.response);
					}
				}
			}

			//Armar la petición POST
			xhr.open('POST',url,true);
			xhr.setRequestHeader('Authorization',token);
			xhr.send(formData);
		});
	}
}

