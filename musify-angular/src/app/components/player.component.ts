import {Component,OnInit} from '@angular/core';
import {Song} from '../models/song';
import {GLOBAL} from '../services/global';

@Component(
{
	selector:'player',
	template:`
	<span *ngIf="song.album">
		<img id="play-image-album" src="{{url + 'get_image_album/' + song.album.image }}">
	</span>
	<span *ngIf="!song.album">
		<img id="play-image-album" src="assets/images/desconocido.jpg"> 
	</span>
		<span id="play-song-title">
			{{song.name}} - {{song.album.artist.name}}
		</span>
		<br/>
	<div class="audio-file"> 
		<audio controls id="player">
			<source id="mp3-source" src="{{url + 'get_song/' + song.file}}" type="audio/mpeg">
			El navegador web no soporta la reproducción de audio.
		</audio>
	</div>`
})

export class PlayerComponent implements OnInit
{
	public url:string;
	public song;

	constructor()
	{
		this.url = GLOBAL.url;
	}

	ngOnInit()
	{
		console.log('Componente player.ts cargado');
		var song = JSON.parse(localStorage.getItem('songPlaying'));
		if(song)
		{
			this.song = song;
		}
		else
		{
			this.song = new Song('',1,'','','');
		}
		console.log(this.song);
	}
}