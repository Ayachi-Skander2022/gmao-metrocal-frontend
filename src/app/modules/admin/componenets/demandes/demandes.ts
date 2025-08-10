import { Component, computed } from '@angular/core';
import { DemandesServiceAdmin } from '../../adminServices/adminService';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../auth/service/notification-service';
import { Userstorage } from '../../../../auth/service/storage/userstorage';

@Component({
  selector: 'app-demandes',
  imports: [CommonModule, DemoNgZorroAntdModule, FormsModule],
  templateUrl: './demandes.html',
  styleUrl: './demandes.scss'
})
export class Demandes {

  demandes: any[] = [];


  techniciens: any[] = [];

   
  filteredDemandes: any[] = [];

  loading = false;
  searchText = '';



  constructor(private demande: DemandesServiceAdmin, private message: NzMessageService, private notificationService: NotificationService) {

    this.fetchDemandes();
    this.getTechniciens();

    const idTechnicien = Userstorage.getUser()?.id;
  if (idTechnicien) {
    this.notificationService.testNotify(idTechnicien);
  }

  }






  fetchDemandes(): void {
  this.loading = true;
  this.demande.getDemandes().subscribe({
  next: (data) => {
  this.demandes = data.map(d => ({
    ...d,
    selectedTechnicienId: d.technicien?.id || null  }));
  this.filteredDemandes = this.demandes;
  this.loading = false;
}
  });
}



getTechniciens() {
  this.demande.getTechniciens().subscribe({
    next: (res) => {
      this.techniciens = res;
    },
    error: (err) => {
      console.error('Erreur lors du chargement des techniciens', err);
    }
  });
}




onSearch(): void {
  const keyword = this.searchText.toLowerCase();
  this.filteredDemandes = this.demandes.filter(d =>
    d.client?.fullName?.toLowerCase().includes(keyword) ||
    d.instrument.nomInstrument.toLowerCase().includes(keyword) ||
    d.instrument.referenceInstrument.toLowerCase().includes(keyword) ||
    d.instrument.constructeur.toLowerCase().includes(keyword) 
    
  );
}





changeDemandeStatus(demandeId: number, status: string) {
  this.demande.updateStatutDemande(demandeId, status).subscribe({
    next: () => {
      this.message.success('Statut de la demande mis à jour avec succès', { nzDuration: 5000 });

      this.notificationService.decrementAdmin(); // maintenant persisté
      this.fetchDemandes();
    },
    error: (error) => {
      this.message.error(`${error.error}`, { nzDuration: 5000 });
    }
  });
}




affecterTechnicien(demandeId: number, technicienId: number): void {
  this.demande.affecterDemande(demandeId, technicienId).subscribe(() => {
    const demande = this.demandes.find(d => d.id === demandeId);
    const technicien = this.techniciens.find(t => t.id === technicienId);

    this.message.success('Technicien affecté avec succès', { nzDuration: 5000 });

    // 🔔 Notification uniquement pour le technicien concerné
    this.notificationService.notifyTechnicien(technicienId);

    if (demande && technicien) {
      demande.technicien = technicien; // mise à jour locale
    }
  });
}



  

}
