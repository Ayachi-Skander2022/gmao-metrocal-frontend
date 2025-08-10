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
  selector: 'app-clientsmetrocal',
  standalone: true,
  imports: [CommonModule, DemoNgZorroAntdModule,  FormsModule , NzDatePickerModule ,
        ReactiveFormsModule,
        NzInputModule,
        NzSelectModule,
        NzDatePickerModule,
        NzInputGroupComponent,
        NzIconModule],
  templateUrl: './clientsmetrocal.html',
  styleUrl: './clientsmetrocal.scss'


})
export class Clientsmetrocal {



      @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;

clients: any[] = [];

filteredClients: any[] = [];

  loading = false;
  searchText = '';

    userId!: any;

     constructor(private demande : DemandesServiceAdmin, private message : NzMessageService) {}

      ngOnInit(): void {
    this.fetchClients();


}



fetchClients(): void {
  this.loading = true;
  this.demande.getClients().subscribe({
    next: (data) => {
      this.clients = data;
      this.filteredClients = data;
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
    this.filteredClients = this.clients.filter(c =>
      c.fullName.toLowerCase().includes(keyword) ||
      c.adresse.toLowerCase().includes(keyword) 
    );
  }
}
