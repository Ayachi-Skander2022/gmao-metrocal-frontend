import { Component, OnInit } from '@angular/core';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../service/auth/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Userstorage } from '../../../service/storage/userstorage';
import { AuthState } from '../../../service/auth/auth-state';

@Component({
  selector: 'app-logincomponent',
  imports: [DemoNgZorroAntdModule, ReactiveFormsModule],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.scss'
})
export class Logincomponent implements OnInit{
  loginForm ! : FormGroup;

  constructor(private fb : FormBuilder, private service : Auth, private message: NzMessageService,  private authState: AuthState,
     private router : Router) {}

  ngOnInit(): void {
      
    this.loginForm = this.fb.group({
      email : ["", [Validators.email, Validators.required]],
      password : ["", Validators.required]
    })

  }

 logForm(): void {
  this.service.login(this.loginForm.value).subscribe({
    next: (res) => {
      console.log(res);

      if (res.userId != null && res.jwt) {
        const user = {
          id: res.userId,
          role: res.userRole
        };

        // ✅ حفظ البيانات
        Userstorage.saveUser(user);
        Userstorage.saveToken(res.jwt);
        
        this.authState.updateRole();
        this.authState.updateId();
 

        // ✅ رسالة نجاح
        this.message.success("Login successful", { nzDuration: 5000 });

        // ✅ التوجيه حسب الدور
        switch (user.role) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'TECHNICIEN':
            this.router.navigate(['/intervenant']);
            break;
          case 'CLIENT':
            this.router.navigate(['/clients']);
            break;

            default:
            this.router.navigate(['/']);
      
        }
      } else {
        this.message.error("Invalid login response", { nzDuration: 5000 });
      }
    },
    error: () => {
      this.message.error("Bad credentials", { nzDuration: 5000 });
    }
  });
}


}
