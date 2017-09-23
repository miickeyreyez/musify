//Definimos la clase que se quiere importar
export class Album
{
	/* public _id: string; ya no es necesario hacer el getter y setter*/
	//A continuación se define el modelo.
	constructor
	(
		public title: string,
		public description: string,
		public year: number,
		public image: string,
		public artist: string
	){}
}