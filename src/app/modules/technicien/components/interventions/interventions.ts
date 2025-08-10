import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Techservice } from '../../techService/techservice';
import { Userstorage } from '../../../../auth/service/storage/userstorage';
import { NotificationService } from '../../../../auth/service/notification-service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-interventions',
  imports:  [CommonModule, DemoNgZorroAntdModule,  NzFormModule, NzCalendarModule, FormsModule , NzDatePickerModule ,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputGroupComponent,
    NzIconModule],
  templateUrl: './interventions.html',
  styleUrl: './interventions.scss'
})
export class Interventions implements OnInit{

  demandes: any[] = [];

 filteredDemandes: any[] = [];

  loading = false;
  searchText = '';

  selectedDemandeId !: number

  interventionForm!: FormGroup;
  isModalVisible = false;



    @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;


  
  constructor(private fb : FormBuilder, private service : Techservice, private modal : NzModalService, private message : NzMessageService,
     private notificationService : NotificationService) {

    
  }


  ngOnInit(): void {

    this.interventionForm = this.fb.group({
  etalonUtilise: ['', Validators.required],
  dureeEtalonnage: ['', Validators.required],
  mesureEtalon: ['', Validators.required],
  mesureInstrument : ['', Validators.required]
 
});

      this.loadDemandes();

  }

  get mesureEtalon(): FormArray {
  return this.interventionForm.get('mesureEtalon') as FormArray;
}

get mesureInstrument(): FormArray {
  return this.interventionForm.get('mesureInstrument') as FormArray;
}


modalRef?: NzModalRef;

openModal(demande: any, modalTitleTemplate: TemplateRef<any>, modalContentTemplate: TemplateRef<any>): void {
  this.selectedDemandeId = demande.id;

  this.modalRef = this.modal.create({
    nzTitle: modalTitleTemplate,
    nzContent: modalContentTemplate,
    nzFooter: null,
    nzWidth: '500px',
    nzStyle: { top: '44px' },
    nzCentered: true
  });

  this.interventionForm.reset(); // réinitialiser le formulaire à chaque ouverture
}



onsubmit(): void {
  if (this.interventionForm.valid) {
    const rawValue = this.interventionForm.value;

    const intervention: Interventions = {
      ...rawValue,
      mesureEtalon: this.parseToFloatArray(rawValue.mesureEtalon),
      mesureInstrument: this.parseToFloatArray(rawValue.mesureInstrument),
    };

    console.log('Intervention prête à l\'envoi:', intervention);

    this.service.createIntervention(this.selectedDemandeId, intervention)
      .subscribe({
        next: () => {
          this.message.success('Intervention ajoutée avec succès');
          this.modalRef?.destroy();
          this.loadDemandes();

          // ✅ Récupère l’ID du technicien lié à la demande sélectionnée
          const demande = this.demandes.find(d => d.id === this.selectedDemandeId);
          const technicienId = demande?.technicien?.id;

          if (technicienId) {
            this.notificationService.decrementTechnicien(technicienId);
          }
        },
        error: err => {
          this.message.error('Erreur lors de la création de l’intervention');
          console.error(err);
        }
      });
  } else {
    this.message.warning('Veuillez remplir tous les champs requis');
  }
}


parseToFloatArray(input: string): number[] {
  if (!input) return [];
  return input
    .split(',')
    .map(v => parseFloat(v.trim()))
    .filter(v => !isNaN(v));
}



  closeModal(): void {
    this.isModalVisible = false;
  }


 loadDemandes(): void {
  this.loading = true;

  const technicienId = +Userstorage.getUserId(); // simple et rapide



  if (!technicienId) {
    console.error('Technicien non connecté ou ID introuvable');
    this.loading = false;
    return;
  }

  this.service.getDemandes(technicienId).subscribe({
    next: (data) => {
      this.demandes = data;
      this.filteredDemandes = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur chargement demandes :', err);
      this.loading = false;
    }
  });
}




   onSearch(): void {
    const keyword = this.searchText.toLowerCase();
    this.filteredDemandes = this.demandes.filter(d =>
      d.nomInstrument.toLowerCase().includes(keyword) ||
      d.client.fullName.toLowerCase().includes(keyword) ||
      d.referenceInstrument.toLowerCase().includes(keyword) ||
      d.constructeur.toLowerCase().includes(keyword)
    );
  }







}
