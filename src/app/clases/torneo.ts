import { SafeResourceUrl } from "@angular/platform-browser";

export class Torneo {
    public id:number;
    public name:string;
    public localidad:string;
    public imagen:string;
    public url:SafeResourceUrl;
    public inscrito:Boolean=false;
}
