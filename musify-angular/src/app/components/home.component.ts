import {Component,OnInit} from '@angular/core';
//Elementos del router para poder hacer redirecciones
//Recoger parámetros de la URL
import {Router,ActivatedRoute, Params} from '@angular/router';

@Component(
{
	selector:'home',
	templateUrl:'../views/home.html',
})

export class HomeComponent implements OnInit
{
	public titulo: string;

	constructor(private _route:ActivatedRoute, private _router:Router)
	{
		this.titulo = 'Musify';
	}

	ngOnInit()
	{
		console.log('Componente home.component.ts cargado');
		//Conseguir el listado de artistas
	}
}