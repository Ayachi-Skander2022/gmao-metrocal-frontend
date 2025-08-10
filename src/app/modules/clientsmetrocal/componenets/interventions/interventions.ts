import { Component } from '@angular/core';
import { DemandeResponseDto } from '../../../demandes-response/demandes-response-module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Userstorage } from '../../../../auth/service/storage/userstorage';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { Techservice } from '../../../technicien/techService/techservice';
import { DemandeService } from '../../clientServices/client-service';




export interface Intervention {
  id: string;
  
  etalonUtilise: string;
  mesures: Mesure[];
  instrument : Instrument,
  ecart: number;
  dureeEtalonnage: string;
  dateIntervention: string;
  technicien: { fullName: string };
    demande?: DemandeResponseDto;
  expand?: boolean;
  level?: number;
  parent?: any;
  children?: Intervention[]; // ✅ Ajout nécessaire pour expansion hiérarchique
}

export interface Mesure {
valeurInstrument: number;
  valeurEtalon: number;
  ecart: number;
  parent?: Intervention; 
}

export interface Instrument{
  nomInstrument : String;
  codeInstrument : String;
}


@Component({
  selector: 'app-interventions',
  imports: [CommonModule, DemoNgZorroAntdModule,  NzFormModule, NzCalendarModule, FormsModule , NzDatePickerModule ,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputGroupComponent,
    NzIconModule],
  templateUrl: './interventions.html',
  styleUrl: './interventions.scss'
})
export class Interventions {




    loading = false;
    searchText = '';
  
    filteredInterventions: Intervention[] = [];
  
    interventions: Intervention[] = [];
  
    Intervention: { [id: string]: Intervention[] } = {};
  
  
    constructor(
      private service: DemandeService,
      private message: NzMessageService
    ) {}
  
    ngOnInit(): void {
      this.loadInterventions();
    }
  
    loadInterventions(): void {
      const technicienId = +Userstorage.getUserId();
  
      this.service.getInterventionsByClient(technicienId).subscribe((data: Intervention[]) => {
        this.interventions = data;
        this.filteredInterventions= data
        // Génération des arbres à partir des mesures
        data.forEach(intervention => {
          const children: Intervention[] = intervention.mesures?.map((mesure, index) => ({
            id: `${intervention.id}-mesure-${index}`,
            etalonUtilise : '',
            mesures: [mesure],
            instrument: {
      nomInstrument: '',
      codeInstrument: ''
    }, // ✅ Objet valide
            ecart: mesure.ecart,
            dureeEtalonnage: '',
            statutEtalonnage: '',
            dateIntervention: '',
            technicien: { fullName: '' },
            level: 1,
            parent: intervention,
            expand: false,
            children: []
          })) || [];
  
          const root: Intervention = {
            ...intervention,
            level: 0,
            expand: false,
            children
          };
  
          this.Intervention[intervention.id] = this.convertTreeToList(root);
        });
      });
    }
  
    collapse(array: Intervention[], data: Intervention, $event: boolean): void {
      if (!$event && data.children) {
        data.children.forEach(child => {
          const target = array.find(a => a.id === child.id);
          if (target) {
            target.expand = false;
            this.collapse(array, target, false);
          }
        });
      }
    }
  
    convertTreeToList(root: Intervention): Intervention[] {
      const stack: Intervention[] = [];
      const array: Intervention[] = [];
      const hashMap: { [id: string]: boolean } = {};
      stack.push({ ...root });
  
      while (stack.length) {
        const node = stack.pop()!;
        this.visitNode(node, hashMap, array);
        if (node.children?.length) {
          for (let i = node.children.length - 1; i >= 0; i--) {
            const child = node.children[i];
            stack.push({ ...child, level: (node.level || 0) + 1, parent: node });
          }
        }
      }
  
      return array;
    }
  
    visitNode(node: Intervention, hashMap: { [id: string]: boolean }, array: Intervention[]): void {
      if (!hashMap[node.id]) {
        hashMap[node.id] = true;
        array.push(node);
      }
    }
  
  
  
  
  
    onSearch(): void {
      const keyword = this.searchText.toLowerCase();
      this.filteredInterventions = this.interventions.filter(i =>
        i.demande?.nomInstrument.toLowerCase().includes(keyword) ||
        i.demande?.client.fullName.toLowerCase().includes(keyword) 
      );
    }


    onDownloadCertificate(id: number): void {
  this.service.downloadCertificate(id)
    .subscribe({
      next: (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du certificat', err);
      }
    });
}



  
}
