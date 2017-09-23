import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions } from '@angular/http';
//Mapeo de objetos
import 'rxjs/add/operator/map';
//Recoger respuestas de peticiones ajax
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import {Album} from '../models/album';

@Injectable()
export class  AlbumService
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

	getAlbums(artistId)
	{
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		if(artistId == null)
		{
			return this._http.get(this.url + 'albums/', options).map(res => res.json());
		}
		else
		{
			return this._http.get(this.url + 'albums/' + artistId, options).map(res => res.json());
		}
		
	}

	getAlbum(id:string)
	{
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		return this._http.get(this.url + 'album/' + id, options).map(res => res.json());
	}

	addAlbum(album:Album)
	{
		let params = JSON.stringify(album);
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});
		
		return this._http.post(this.url + 'album/', params, options).map(res => res.json());
	}

	editAlbum(id, album:Album)
	{
		let params = JSON.stringify(album);
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		return this._http.put(this.url + 'album/' + id, params, options).map(res => res.json());
	}

	deleteAlbum(id:string)
	{
		let headers = new Headers
		({
			'Content-Type':'application/json',
			'Authorization':this.token
		});

		let options = new RequestOptions({headers:headers});

		return this._http.delete(this.url + 'album/' + id, options).map(res => res.json());
	}

}
