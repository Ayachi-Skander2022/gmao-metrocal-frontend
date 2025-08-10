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
  selector: 'app-instruments',
  imports: [CommonModule, DemoNgZorroAntdModule,  NzFormModule, NzCalendarModule, FormsModule , NzDatePickerModule ,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputGroupComponent,
    NzIconModule],
  templateUrl: './instruments.html',
  styleUrl: './instruments.scss'
})
export class Instruments implements OnInit{

   @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;

  
  instrumentForm !: FormGroup;

  typesEtalonnage: string[] = ['Sur Site', 'Laboratoire'];
  typesMesure: string[] = ['Température', 'Pression', 'Humidité', 'Vitesse', 'Autre'];
  uniteMesure: string[] = ['Celsius', 'Fahrenheit', 'Pascal', 'Bar', 'Pourcentage', 'Autre'];



instruments: any[] = [];

filteredInstruments: any[] = [];

  loading = false;
  searchText = '';

    userId!: any;


  constructor(private fb : FormBuilder, private modal : NzModalService, private demande :DemandeService,
    private notificationService: NotificationService, 
    private message : NzMessageService) {}


    ngOnInit(): void {
    this.fetchInstruments();

     this.instrumentForm = this.fb.group({
    nomInstrument: ['', Validators.required],
    referenceInstrument: ['' , Validators.required],
    constructeur: [''  , Validators.required],
    typeMesure: [''  , Validators.required],
    minMesure: [''  , Validators.required],
    maxMesure: [''  , Validators.required],
    uniteMesure: [''  , Validators.required],

  });

  

   

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
  if (this.instrumentForm.valid) {
    const formValue = this.instrumentForm.value;

    const instrument = {
      ...formValue,
    

      user: {
        id: Userstorage.getUser()?.id  // récupère l'utilisateur connecté
      }
    };

    this.demande.addInstrument(instrument).subscribe({
      next: () => {
        this.modalRef?.close();
        this.message.success('Instrument ajouté avec succès !');
        this.instrumentForm.reset(); 
        console.log("Instrument ajouté !");

        this.fetchInstruments(); // Recharger les demandes après l'ajout

      },
      error: (error) => {
        console.error("Erreur lors de l'ajout de la demande :", error);
      }
    });

  } else {
    Object.values(this.instrumentForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
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


  onSearch(): void {
    const keyword = this.searchText.toLowerCase();
    this.filteredInstruments = this.instruments.filter(d =>
      d.codeInstrument.toLowerCase().includes(keyword) ||
      d.nomInstrument.toLowerCase().includes(keyword) ||
      d.referenceInstrument.toLowerCase().includes(keyword) ||
      d.constructeur.toLowerCase().includes(keyword)
    );
  }


}
