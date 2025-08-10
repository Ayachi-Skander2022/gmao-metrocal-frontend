import { Component, OnInit } from '@angular/core';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Auth } from '../../../service/auth/auth';
@Component({
  selector: 'app-register-client',
  imports: [DemoNgZorroAntdModule, ReactiveFormsModule, ],
  templateUrl: './register-client.html',
  styleUrl: './register-client.scss'
})
export class RegisterClient implements OnInit{
  registerClient!  : FormGroup

constructor(private fb: FormBuilder, private authService : Auth, private message: NzMessageService, 
              private router : Router){}


ngOnInit(): void {
  this.registerClient = this.fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      adresse: [null, [Validators.required]],
      telephone: [null, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

 }

submitForm() {
  if (this.registerClient.invalid) return;

  this.authService.registerC(this.registerClient.value).subscribe({
    next: res => {
      this.message.success(" Inscription réussie", { nzDuration: 5000 });
      this.router.navigateByUrl("/");
    },
    error: err => {
      // Récupérer le message du backend
      let msg = " Une erreur est survenue";
      
      // Le backend retourne une chaîne de texte directement (ex: "Client Already exists")
      if (err.status === 406) {
        msg = " Cet email est déjà utilisé.";
      } else if (err.status === 400) {
        msg = " Impossible de créer le compte, veuillez réessayer.";
      } else if (typeof err.error === 'string') {
        msg = ` ${err.error}`;
      }

      this.message.error(msg, { nzDuration: 5000 });
    }
  });
}



}
