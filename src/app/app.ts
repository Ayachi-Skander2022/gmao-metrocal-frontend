import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Userstorage } from './auth/service/storage/userstorage';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntdModules';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from './auth/service/notification-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NzIconModule, DemoNgZorroAntdModule, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('gmao_metrocal');

  // ✅ utiliser le signal partagé de Userstorage
  userRole = Userstorage.userRoleSignal; // C’est un signal réactif !


  technicienNotifCount!: Signal<number>;

  
  constructor(private router: Router, private notificationService: NotificationService) {



  }


  ngOnInit(): void {
       const userIdStr = Userstorage.geTechId();
  const userIdNum = Number(userIdStr);
  if (!isNaN(userIdNum)) {
    this.technicienNotifCount = this.notificationService.getTechnicienSignal(userIdNum);
  }
  }
  

   adminNotification() {
    return this.notificationService.adminNotification();
  }




  navItems = computed(() => {


    switch (this.userRole()) {
      case 'ADMIN':
        return [
      
  { icon: 'home', label: 'Dashboard', link: '/admin/dashboard' },
  { icon: 'team', label: 'Techniciens', link: '/admin/techniciens' },
  { label: 'Clients', icon: 'user', link: '/admin/clients' },
  { icon: 'file-text', label: 'Demandes', link: '/admin/demandes' ,   showBadge:true
},
  { icon: 'setting', label: 'Interventions', link: '/admin/interventions' },
  { icon: 'build', label: 'Instruments', link: '/admin/instruments' },
    { icon: 'build', label: 'Etalons', link: '/admin/etalons' },
  { icon: 'bar-chart', label: 'Statistiques', link: '/admin/statistiques' },
  { label: 'Logout', icon: 'logout', action: () => this.logout() },

        ];


      case 'CLIENT':
        return [
  { icon: 'home', label: 'Accueil', link: '/clients/dashboard' },
  { icon: 'file-text', label: 'Mes Instruments', link: '/clients/instruments' },
  { icon: 'file-text', label: 'Mes Demandes', link: '/clients/demandes' },
  { icon: 'tool', label: 'Interventions', link: '/clients/interventions' }, // 🆕
  { icon: 'file-text', label: 'Certificats ', link: '/clients/rapports' },
  { icon: 'logout', label: 'Déconnexion', action: () => this.logout() }
        ];


      case 'TECHNICIEN':
        return[
  { icon: 'home', label: 'Accueil', link: '/intervenant/dashboard' },
  { icon: 'calendar', label: 'Demandes', link: '/intervenant/interventions', showBadge: true },
    { icon: 'calendar', label: 'Interventions List', link: '/intervenant/interventions_list', showBadge: true },
  { icon: 'history', label: 'Historique', link: '/intervenant/historique' },
  { icon: 'logout', label: 'Déconnexion', action: () => this.logout() }
];
     
default:
        return [
          { label: 'Register Staff', icon: 'idcard', link: '/register' },
          { label: 'Register Client', icon: 'solution', link: '/registerc' },
          { label: 'Login', icon: 'login', link: '/' }
        ];
    }
  });

  navItems$: Observable<ReturnType<typeof this.navItems>> = toObservable(this.navItems);


  logout() {
    Userstorage.sigOut();
    this.router.navigateByUrl('/');
  }


  isCollapsed = false;

}
