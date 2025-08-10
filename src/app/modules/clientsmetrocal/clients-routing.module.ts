import { Routes } from '@angular/router';
import { Dashboard } from './componenets/dashboard/dashboard';
import { Demandes } from './componenets/demandes/demandes';
import { Rapports } from './componenets/rapports/rapports';
import { Interventions } from './componenets/interventions/interventions';
import { Instruments } from './componenets/instruments/instruments';

export const clientsRoutes: Routes = [

  { path: 'dashboard', component: Dashboard },
  { path: 'demandes', component: Demandes },
  { path: 'rapports', component: Rapports },
  { path: 'interventions', component: Interventions },
  { path: 'instruments', component: Instruments },


   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

];