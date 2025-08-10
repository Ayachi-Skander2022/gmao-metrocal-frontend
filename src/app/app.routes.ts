import { Routes } from '@angular/router';
import { Logincomponent } from './auth/components/login/logincomponent/logincomponent';
import { RegisterComponent } from './auth/components/register/register-component/register-component';
import { RegisterClient } from './auth/components/register/register-client/register-client';


export const routes: Routes = [
      {path: '', component: Logincomponent},
      {path: 'register', component:RegisterComponent},
      {path: 'registerc', component:RegisterClient},

{
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin-routing.module').then((m) => m.adminRoutes),
},

{
    path: 'clients',
    loadChildren: () =>
      import('./modules/clientsmetrocal/clients-routing.module').then((m) => m.clientsRoutes),
},

{
    path: 'intervenant',
    loadChildren: () =>
      import('./modules/technicien/technicien-routing.module').then((m) => m.technicienRoutes),
}
 
 
];
