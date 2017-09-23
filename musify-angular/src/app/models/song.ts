//Definimos la clase que se quiere importar
export class Song
{
	//A continuación se define el modelo.
	constructor
	(
		public name: string,
		public number: number,
		public duration: string,
		public file: string,
		public album: string
	){}
}