import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
//Mapeo de objetos
import 'rxjs/add/operator/map';
//Recoger respuestas de peticiones ajax
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class  UserService
{
	public url: string;
	public identity;
	public token;
	public name;

	//Inyectar http
	constructor(private _http:Http) 
	{
		this.url =  GLOBAL.url;
	}

	//Petición para el login
	signUp(user2login, getHash = null)
	{
		//return 'Hola mundo desde angular';
		if(getHash != null)
		{
			user2login.gethash = getHash;
		}

		//Petición al REST
		let json = JSON.stringify(user2login);
		let params = json;

		//Headers de Java Script
		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url + 'login',params,{headers:headers}).map(res => res.json());
	}

	//Acceder al localStorage, obtener elemento y retornarlo
	getIdentity()
	{
		let identity = JSON.stringify(localStorage.getItem('identity'));
		if(identity != "undefined")
		{
			this.identity = identity;
		}
		else
		{
			this.identity = null;
		}
		return this.identity;
	}

	getToken()
	{
		let token = JSON.stringify(localStorage.getItem('token'));
		if(token != "undefined")
		{
			this.token = token;
		}
		else
		{
			this.token = null;
		}
		return this.token;
	}

	getName()
	{
		let name = JSON.stringify(localStorage.getItem('name'));
		if(name != "undefined")
		{
			this.name = name;
		}
		else
		{
			this.name = null;
		}
		return this.name;
	}

	register(user2register)
	{
		//Petición al REST
		let params = JSON.stringify(user2register);

		//Headers de Java Script
		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url + 'register',params,{headers:headers}).map(res => res.json());	
	}

	updateUser(user2update)
	{
		console.log("2upd" + user2update._id);
		console.log(this.getToken());
		//Petición al REST
		let params = JSON.stringify(user2update);

		//Headers de Java Script
		let headers = new Headers({
			'Content-Type':'application/json',
			//Para ver si el usuario está logueado.
			'Authorization':this.getToken()
		});

		return this._http.put(this.url + 'update_user/' + user2update._id,params,{headers:headers}).map(res => res.json());	
	}
}