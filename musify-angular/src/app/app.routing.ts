//Configuración del router de la aplicación
//Funcionalidad del router
import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

//Componentes que tienen que ver con el usuario
import {UserEditComponent} from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

const appRoutes:Routes = 
[
	//Ruta del home
	{path: '',component:HomeComponent},
	//Ruta de redirección (home del sistema)
	//{path: '',redirectTo:'/artist/1',pathMatch:'full'},
	//{path: '',component:ArtistListComponent},
	{path: 'miPerfil',component:UserEditComponent},
	{path: 'artists/:page',component:ArtistListComponent},
	{path: 'artist-add',component:ArtistAddComponent},
	{path: 'artist-edit/:id',component:ArtistEditComponent},
	{path: 'artist-detail/:id',component:ArtistDetailComponent},
	{path: 'album-add/:id',component:AlbumAddComponent},
	{path: 'album-edit/:id',component:AlbumEditComponent},
	{path: 'album-detail/:id',component:AlbumDetailComponent},
	{path: 'song-add/:id',component:SongAddComponent}, //Id del album
	{path: 'song-edit/:id',component:SongEditComponent},
	//Ruta que no existe
	{path: '**',component:HomeComponent}

];

export const appRoutingProviders:any[] = [];
//Routing
export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes);