import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { DemandesServiceAdmin } from '../../adminServices/adminService';

@Component({
  selector: 'app-techniciens',
  imports: [CommonModule, DemoNgZorroAntdModule,  FormsModule , NzDatePickerModule ,
        ReactiveFormsModule,
        NzInputModule,
        NzSelectModule,
        NzDatePickerModule,
        NzInputGroupComponent,
        NzIconModule],
  templateUrl: './techniciens.html',
  styleUrl: './techniciens.scss'
})
export class Techniciens {


  

      @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;

techniciens: any[] = [];

filteredTechniciens: any[] = [];

  loading = false;
  searchText = '';

    userId!: any;

     constructor(private demande : DemandesServiceAdmin, private message : NzMessageService) {}

      ngOnInit(): void {
    this.fetchTechniciens();


}



fetchTechniciens(): void {
  this.loading = true;
  this.demande.getTechniciens().subscribe({
    next: (data) => {
      this.techniciens = data;
      this.filteredTechniciens = data;
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
    this.filteredTechniciens = this.techniciens.filter(t =>
      t.fullName.toLowerCase().includes(keyword) ||
      t.adresse.toLowerCase().includes(keyword) 
    );
  }

}
