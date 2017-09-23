import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Importar modulo para formularios
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
//Cargamos el componente para edición de usuario
import { UserEditComponent } from './components/user-edit.component';
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
import { PlayerComponent } from './components/player.component';
//Se importa el router
import {routing,appRoutingProviders} from './app.routing';

@NgModule({
  //Componentes y directivas
  declarations: [
    AppComponent,
    UserEditComponent, //Para acceder a las directivas dentro del componente
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  //Módulos propios y del framework
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing //Módulo de componentes
  ],
  //Servicios
  providers: [appRoutingProviders], //Provider
  //Componente principal
  bootstrap: [AppComponent]
})
export class AppModule { }
