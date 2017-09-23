import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions } from '@angular/http';
//Mapeo de objetos
import 'rxjs/add/operator/map';
//Recoger respuestas de peticiones ajax
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class  UploadService
{
	public url: string;

	//Inyectar http
	constructor(private _http:Http) 
	{
		this.url =  GLOBAL.url;
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>, token:string, name:string)
	{
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
				formData.append(name,files[i],files[i].name);
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