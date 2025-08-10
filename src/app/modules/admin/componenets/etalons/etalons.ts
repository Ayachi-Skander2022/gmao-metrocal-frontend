import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NotificationService } from '../../../../auth/service/notification-service';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { DemandesServiceAdmin } from '../../adminServices/adminService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

export interface Etalon {
  id?: number;
  nom: string;
  reference: string;
  etat: string;
  image?: string; // data:image/png;base64,...
}

@Component({
  selector: 'app-etalons',
  imports: [CommonModule, DemoNgZorroAntdModule,  NzFormModule, NzCalendarModule, FormsModule , NzDatePickerModule ,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputGroupComponent,
    NzIconModule],
  templateUrl: './etalons.html',
  styleUrl: './etalons.scss'

  
})



export class Etalons {


  @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;

  
  etalonForm !: FormGroup;

  typesEtalonnage: string[] = ['Sur Site', 'Laboratoire'];
  typesMesure: string[] = ['Température', 'Pression', 'Humidité', 'Vitesse', 'Autre'];
  uniteMesure: string[] = ['Celsius', 'Fahrenheit', 'Pascal', 'Bar', 'Pourcentage', 'Autre'];



etalons: any[] = [];

filteredEtalon: any[] = [];

  loading = false;
  searchText = '';


  selectedFile!: File | null;
  isEdit: boolean = false;
  editId!: number;

  isSubmitting !: boolean;



  etats: string[] = ['EN_MARCHE', 'EN_PANNE'];

  constructor(private fb : FormBuilder, private modal : NzModalService, private service :DemandesServiceAdmin,
    private notificationService: NotificationService, private sanitizer: DomSanitizer,
    private message : NzMessageService) {}


    ngOnInit(): void {
    this.fetchEtalons();
    this.formatImage

    this.etalonForm = this.fb.group({
  nom: ['', Validators.required],
  reference: ['', Validators.required],
  etat: ['', Validators.required],
  image: [''] // base64
});




}






  trackByType(index: number, item: string): string {
  return item;
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

 
onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  
  if (!input.files?.length) {
    this.selectedFile = null;
    return;
  }

  const file = input.files[0];
  
  // Validation du fichier
  if (!file.type.match('image.*')) {
    this.message.error('Seules les images sont acceptées');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    this.message.error('La taille de l\'image ne doit pas dépasser 2MB');
    return;
  }

  // Stockage du fichier pour l'envoi
  this.selectedFile = file;

  // Prévisualisation
  const reader = new FileReader();
  reader.onload = () => {
    this.etalonForm.patchValue({ 
      image: reader.result as string 
    });
  };
  reader.readAsDataURL(file);
}



onSubmit() {
  if (this.etalonForm.invalid) {
    this.message.error('Veuillez remplir tous les champs obligatoires');
    return;
  }

  this.isSubmitting = true;

  const formValue = this.etalonForm.value;
  const etalonData = {
    ...formValue,
    image: this.selectedFile || formValue.image
  };

  const operation = this.isEdit 
    ? this.service.updateEtalon(this.editId, etalonData)
    : this.service.addEtalon(etalonData);

  operation.subscribe({
    next: () => {
      this.message.success(`Étalon ${this.isEdit ? 'modifié' : 'ajouté'} avec succès`);
      this.resetForm();
      this.fetchEtalons();
      this.modalRef?.close();
    },
    error: (err) => {
      console.error('Erreur:', err);
      let errorMsg = 'Erreur lors de l\'opération';
      
      if (err.status === 403) {
        errorMsg = 'Accès refusé - Vérifiez vos permissions';
      } else if (err.error?.message) {
        errorMsg = err.error.message;
      }
      
      this.message.error(errorMsg);
      this.isSubmitting = false;
    }
  });
}


private dataURLtoBlob(dataURL: string): Blob {
  try {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error('Error converting data URL to Blob:', e);
    throw new Error('Invalid image data');
  }
}


 fetchEtalons(): void {
  this.loading = true;
  this.service.getAllEtalons().subscribe({
    next: (data) => {
      this.etalons = data;
      this.filteredEtalon = data;
      this.loading = false;
    },
    error: () => {
      this.message.error("Échec du chargement des demandes.");
      this.loading = false;
    }
  });
}

edit(etalon: any) {
  this.isEdit = true;
  this.editId = etalon.id;
  
  this.etalonForm.patchValue({
    nom: etalon.nom,
    reference: etalon.reference,
    etat: etalon.etat,
    image: etalon.image ? this.formatImageString(etalon.image) : null
  });
}



private cleanImageData(image: string): string {
  if (image.startsWith('data:image')) {
    return image.split(',')[1]; // Retourne seulement la partie base64
  }
  return image; // Retourne tel quel si déjà en base64
}



// In your component class
formatImage(image: string | null | undefined): SafeUrl {
  if (!image) {
    return this.sanitizer.bypassSecurityTrustUrl(''); // Return empty safe URL
  }
  
  // Check if it's already a data URL
  if (typeof image === 'string' && image.startsWith('data:image')) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }
  
  // Assume it's base64 and format it
  return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${image}`);
}

formatImageString(image: string | null | undefined): string {
  if (!image) return '';
  
  if (typeof image === 'string' && image.startsWith('data:image')) {
    return image;
  }
  
  return `data:image/jpeg;base64,${image}`;
}






   delete(id: number) {
    this.service.deleteEtalon(id).subscribe(() => {
      this.fetchEtalons();
        this.message.success('Etalon supprimé avec succès !');
    });
  }
  
  
resetForm() {
  this.etalonForm.reset({
    nom: '',
    reference: '',
    etat: '',
    image: null
  });
  this.selectedFile = null;
  this.isEdit = false;
  this.editId = 0;
  this.isSubmitting = false;
}

  onSearch(): void {
    const keyword = this.searchText.toLowerCase();
    this.filteredEtalon = this.etalons.filter(e =>
      e.code.toLowerCase().includes(keyword) ||
      e.nom.toLowerCase().includes(keyword) ||
      e.reference.toLowerCase().includes(keyword) 
    );
  }


}
