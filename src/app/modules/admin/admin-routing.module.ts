import { Routes } from '@angular/router';
import { Instruments } from './componenets/instruments/instruments';
import { Clientsmetrocal } from './componenets/clientsmetrocal/clientsmetrocal';
import { Dashboard } from './componenets/dashboard/dashboard';
import { Affectation } from './componenets/affectation/affectation';
import { Demandes } from './componenets/demandes/demandes';
import { Statistiques } from './componenets/statistiques/statistiques';
import { Interventions } from './componenets/interventions/interventions';
import { Techniciens } from './componenets/techniciens/techniciens';
import { Etalons } from './componenets/etalons/etalons';

export const adminRoutes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'instruments', component: Instruments },
    { path: 'etalons', component: Etalons },
    { path: 'techniciens', component: Techniciens },
  { path: 'clients', component: Clientsmetrocal },
  { path: 'affectation', component: Affectation },
  { path: 'demandes', component: Demandes },
  { path: 'statistiques', component: Statistiques },
  { path: 'interventions', component: Interventions },

   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

];

