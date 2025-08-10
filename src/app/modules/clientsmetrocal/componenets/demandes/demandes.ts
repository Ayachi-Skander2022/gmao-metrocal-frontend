import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';


import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DemandeService } from '../../clientServices/client-service';

import { NzMessageService } from 'ng-zorro-antd/message';
import { Userstorage } from '../../../../auth/service/storage/userstorage';
import { NotificationService } from '../../../../auth/service/notification-service';



@Component({
  selector: 'app-demandes',
  imports: [CommonModule, DemoNgZorroAntdModule,  NzFormModule, NzCalendarModule, FormsModule , NzDatePickerModule ,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputGroupComponent,
    NzIconModule],


  templateUrl: './demandes.html',
  styleUrl: './demandes.scss'
})
export class Demandes  implements OnInit {

  @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;

  
  demandeForm !: FormGroup;

  typesEtalonnage: string[] = ['Sur Site', 'Laboratoire'];
  typesMesure: string[] = ['Température', 'Pression', 'Humidité', 'Vitesse', 'Autre'];
  uniteMesure: string[] = ['Celsius', 'Fahrenheit', 'Pascal', 'Bar', 'Pourcentage', 'Autre'];



demandes: any[] = [];

filteredDemandes: any[] = [];

  loading = false;
  searchText = '';

    userId!: any;

    selectedInstrumentId!: number;


    instruments: any[] = [];

filteredInstruments: any[] = [];


  constructor(private fb : FormBuilder, private modal : NzModalService, private demande :DemandeService,
    private notificationService: NotificationService, 
    private message : NzMessageService) {}

  ngOnInit(): void {


      this.fetchInstruments()

    this.fetchDemandes();

     this.demandeForm = this.fb.group({
     instrumentId: [null, [Validators.required]],
    typeEtalonnage: [''  , Validators.required],
    dateSouhaitee: [null , Validators.required],
  });

  

   this.filteredDemandes = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    client: 'Client ' + (i + 1),
    date: new Date(),
    // autres champs
  }));

}

getStatutEtalonnageLabel(status: string): string {
  const s = status?.toUpperCase(); // éviter les erreurs si undefined

  switch (s) {
    case 'EN_ATTENTE': return 'En attente';
    case 'EN_COURS': return 'En cours';
    case 'ETALONNE': return 'Etalonné';
    default: return 'Inconnu';

  }


}




modalRef?: NzModalRef;

openModal(): void {
  this.modalRef = this.modal.create({
    nzTitle: this.modalTitleTemplate,
    nzContent: this.modalContentTemplate,
    nzFooter: null, // footer customisé dans template

  nzWidth: '500px',
  nzStyle: { top: '44px' },
  nzCentered: true,
   
  });
}

  
submitForm(): void {
  if (this.demandeForm.valid) {
    const formValue = this.demandeForm.value;
    const instrumentId = formValue.instrumentId;

    // ✅ Vérification si une demande existe déjà avec cet instrument
    const instrumentDejaUtilise = this.demandes
      ?.some(d => d.instrument?.id === instrumentId || d.instrumentId === instrumentId);

    if (instrumentDejaUtilise) {
      this.message.warning('Une demande avec cet instrument existe déjà.');
      return; // Empêche l'envoi
    }

    const demande = {
      ...formValue,
      dateDemande: new Date().toISOString().split('T')[0],
      statutEtalonnage: 'EN_ATTENTE',
      statutDemande: 'PENDING'
    };

    this.demande.createDemande(demande, instrumentId).subscribe({
      next: () => {
        this.modalRef?.close();
        this.message.success('Demande ajoutée avec succès !');
        this.demandeForm.reset();
        this.fetchDemandes();
        this.notificationService.incrementAdmin();
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout de la demande :", error);
      }
    });
  } else {
    Object.values(this.demandeForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
}




 fetchDemandes(): void {
  this.loading = true;
  this.demande.getDemandesByClientId().subscribe({
    next: (data) => {
      this.demandes = data;
      this.filteredDemandes = data;
      this.loading = false;
    },
    error: () => {
      this.message.error("Échec du chargement des demandes.");
      this.loading = false;
    }
  });
}


  onSearch(): void {
    const keyword = this.searchText.toLowerCase();
    this.filteredDemandes = this.demandes.filter(d =>
      d.nomInstrument.toLowerCase().includes(keyword) ||
      d.referenceInstrument.toLowerCase().includes(keyword) ||
      d.constructeur.toLowerCase().includes(keyword)
    );
  }




  fetchInstruments(): void {
  this.loading = true;
  this.demande.getInstrumentsByClientId().subscribe({
    next: (data) => {
      this.instruments = data;
      this.filteredInstruments = data;
      this.loading = false;
    },
    error: () => {
      this.message.error("Échec du chargement des demandes.");
      this.loading = false;
    }
  });
}



  }

