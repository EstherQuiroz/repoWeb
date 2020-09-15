import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Login } from './../../models/login';
import { LoginService } from './../../service/login.service';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  styles: ['input.ng-valid{border:2px solid #38a9b8;} input.ng-invalid.ng-touched{border:2px solid #ff0000c5;}']

})
export class LoginComponent implements OnInit {

  public user:any;
  loginForm: FormGroup
  constructor(private fb: FormBuilder, public auth:LoginService,private router:Router, private toastr: ToastrService) {
    this.buildForm();
  }

  
  showWarning() {
    this.toastr.error('¡La contraseña o el nickname no coinciden!');
  }
//Validaciones parte front
  buildForm() {
    this.loginForm = this.fb.group({
      nickname: new FormControl(null, Validators.required),
      pass: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  onSubmit() {
    console.log(this.loginForm.value)
  }

//Para la autentificacion y redirigir a las paginas
  authLogin2(nick:string,pass:string){
    let login= new Login;
    login.nickname=nick;
    login.password=pass;
    this.auth.authLogin(login).subscribe((data)=>{ 
      this.auth.userId=data;
      //console.log(this.auth.userId)
      if(this.auth.userId[0]===undefined){
        this.router.navigate(['/login'])
        this.showWarning()
      }else{
        this.auth.check=true
        this.auth.setUser(data)
        this.router.navigate(['/mostrarLibro'])
      }
      console.log(this.auth.check)
    })
    
    
}


  ngOnInit(): void {
  }
}
