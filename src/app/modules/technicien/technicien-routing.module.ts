import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Historique } from './components/historique/historique';
import { Interventions } from './components/interventions/interventions';
import { InterventionsList } from './components/interventions-list/interventions-list';


export const technicienRoutes: Routes = [

  { path: 'dashboard', component: Dashboard },
  { path: 'historique', component: Historique },
  { path: 'interventions', component: Interventions },
  { path: 'interventions_list', component: InterventionsList },


   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

];