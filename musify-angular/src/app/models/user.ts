//Definimos la clase que se quiere importar
export class User
{
	/* public _id: string; ya no es necesario hacer el getter y setter*/
	//A continuación se define el modelo.
	constructor
	(
		public _id: string,
		public name: string,
		public surname: string,
		public email: string,
		public password: string,
		public role: string,
		public image: string
	){}
}