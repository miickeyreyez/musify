import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions } from '@angular/http';
//Mapeo de objetos
import 'rxjs/add/operator/map';
//Recoger respuestas de peticiones ajax
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import {Song} from '../models/song';

@Injectable()
export class  SongService
{
	public url: string;
	public token:string;
	public headers:Headers;

	//Inyectar http
	constructor(private _http:Http) 
	{
		this.url =  GLOBAL.url;
		this.token = localStorage.getItem('token');
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});
	}

	getSong(id:string)
	{
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		return this._http.get(this.url + 'song/' + id, options).map(res => res.json());
	}

	getSongs(id = null)
	{
		//id = id || null;
		console.log(id);
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});
		let options = new RequestOptions({headers:headers});

		if(id == null)
		{
			return this._http.get(this.url + 'songs/', options).map(res => res.json());	
		}
		else
		{
			return this._http.get(this.url + 'songs/' + id, options).map(res => res.json());	
		}

	}

	addSong(song:Song)
	{
		let params = JSON.stringify(song);
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});
		
		return this._http.post(this.url + 'song/', params, options).map(res => res.json());
	}

	editSong(id, song:Song)
	{
		let params = JSON.stringify(song);
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		return this._http.put(this.url + 'song/' + id, params, options).map(res => res.json());
	}

	deleteSong(id:string)
	{
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		return this._http.delete(this.url + 'song/' + id, options).map(res => res.json());
	}

}
