import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { LoginService } from "./../../service/login.service";
import { ApisService } from "src/app/service/apis.service";
import { Peticiones } from "src/app/models/peticiones";
import { MostrarLibros } from "src/app/models/mostrar-libros";
import { MostrarLibrosService } from "src/app/service/mostrar-libros.service";
import { Favorites } from "./../../models/favorites";
import { Data } from 'ngx-bootstrap/positioning/models';

@Component({
  selector: "app-mostrar-libros",
  templateUrl: "./mostrar-libros.component.html",
  styleUrls: ["./mostrar-libros.component.scss"],
})
export class MostrarLibrosComponent implements OnInit {
  modalRef: BsModalRef;
  public book: MostrarLibros[];
  public bookCarousel : MostrarLibros[];
  public bookCarousel1 :MostrarLibros[];
  public bookCarousel2 :MostrarLibros[];
  public bookCarousel3 :MostrarLibros[];
  public userbook:any=[];
  public fav:any;
  public datosPeticion:any;
  public bookId:number;
  public oneBook:any;
  public buscar:string = '';
  constructor(private modalService: BsModalService, private valor:LoginService, private api: ApisService) {}

  getValor() {
    return this.valor.getUser();
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  //Mostrar libros
  mostrarLibros() {
    this.api.getLibros().subscribe((data: MostrarLibros[]) => {
      this.book = data;
      console.log(data)
    });
  }
  mostrarLibrosCarousel() {
    this.api.getLibros().subscribe((data: MostrarLibros[]) => {
      this.bookCarousel=data
      this.bookCarousel1=this.bookCarousel.splice(data.length-9);
      this.bookCarousel2 = this.bookCarousel1.splice(2,6);
      this.bookCarousel3 = this.bookCarousel2.splice(0,3);
    });
  }
  mostrartype(type) {
    this.api.gettype(type).subscribe((data: MostrarLibros[]) => {
      this.book = data;
      //console.log(type);
    });
  }
  mostrarTitleAuthor(title:string){
    this.api.getBookTitle(title).subscribe((data:MostrarLibros[])=>{
      // this.book=data
      console.log(data)
      this.api.getBookAuthor(title).subscribe((data2:MostrarLibros[])=>{
        this.book=data.concat(data2);
        console.log(data2)
        console.log(this.book)
        console.log(this.bookId)
      })
    })
    
  }
  getbookId(id){
    this.bookId=id;
    return this.bookId
    console.log(this.bookId)
  }
  getOneBook(id:number){
    console.log(id)
    this.api.getModifica(id).subscribe((data)=>{
      console.log(this.oneBook)
      this.oneBook=data[0];
    })
  }
//Crear peticion
  getBookUser(id:number){
    return this.api.getUserBook(id).subscribe((data:any)=>{
      let datos=data
      let i=0
      while((datos[i].user_id==this.valor.getUser()[0].user_id)&&(i<datos.length)){
        datos.splice(i,1)
        i++
        // i<datos.length
      }
      for (let i=0;i<datos.length;i++){
        if(datos[i].user_id==this.valor.getUser()[0].user_id){
          datos.splice(i,1)
        }
      }
      this.userbook = datos;
      //console.log(data)
    });
  }

  postPeticion(user_idRequest: any) {
    let variable = new Peticiones();
    variable.user_idRequest = user_idRequest;
    variable.book_id = this.userbook[0].book_id;
    variable.user_id = this.valor.getUser()[0].user_id;
    variable.status = "Pendiente";
    console.log(user_idRequest);
    let existe = false;
    console.log(existe);
    for (let i = 0; i < this.datosPeticion.length; i++) {
      if (
        this.datosPeticion[i].user_idRequest == user_idRequest.substr(0, 1) &&
        this.datosPeticion[i].book_id == this.userbook[0].book_id
      ) {
        existe = true;
      }
      console.log(this.datosPeticion[i].user_idRequest);
      console.log(user_idRequest.substr(0, 1));
    }
    console.log(existe);
    if (!existe) {
      return this.api.postPetition(variable).subscribe((data) => {
        //console.log(data);
        this.getPeticion();
      });
    }
  }
  getPeticion() {
    let variable = this.valor.getUser()[0].user_id;
    return this.api.getPetition(variable).subscribe((data) => {
      this.datosPeticion = data;
      //console.log(data)
    });
  }

  //Crear favorito

  addFavorito(bookId: number) {
    let favorito = new Favorites();
    favorito.user_id = this.valor.getUser()[0].user_id;
    favorito.book_id = bookId;
    let existe2 = false;
    for (let i = 0; i < this.fav.length; i++) {
      if (this.fav[i].book_id == bookId) {
        existe2 = true;
      }
    }
    if (existe2 == false) {
      return this.api.postFavorites(favorito).subscribe((data) => {
        console.log(data);
        this.getFav();
      });
    }
  }
  getFav() {
    let user_id = this.valor.getUser()[0].user_id;
    return this.api.getFavorites(user_id).subscribe((data) => {
      this.fav = data;
      //console.log(data)
    });
  }

  background(type){
    let fondo;
    if(type == 'Misterio'){
      fondo = 'background1'
    }else if(type == 'Fantasia'){
      fondo = 'background2'
    }else if(type == 'Ciencia Ficcion'){
      fondo = 'background3'
    }else if(type == 'Historico'){
      fondo = 'background4'
    }else if(type == 'Biografias'){
      fondo = 'background5'
    }else if(type == 'Filosofia'){
      fondo = 'background6'
    }else if(type == 'Aventura'){
      fondo = 'background7'
    }else if(type == 'Novela'){
      fondo = 'background9'
    }else if(type == 'Novela negra'){
      fondo = 'background10'
    }else if(type == 'Comic'){
      fondo = 'background11'
    }
    
    return fondo
  }

  

  ngOnInit() {
    this.mostrarLibros();
    this.mostrarLibrosCarousel();
    this.getPeticion();
    this.getFav();
    
  }
}
