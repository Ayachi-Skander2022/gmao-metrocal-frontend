import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { DemandesServiceAdmin } from '../../adminServices/adminService';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instruments',
  standalone: true,
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


export class Instruments {

    @ViewChild('modalContentTemplate', { static: true }) modalContentTemplate!: TemplateRef<any>;

  @ViewChild('modalTitleTemplate', { static: true }) modalTitleTemplate!: TemplateRef<any>;

  instruments: any[] = [];

filteredInstruments: any[] = [];

  loading = false;
  searchText = '';

    userId!: any;

     constructor(private demande : DemandesServiceAdmin, private message : NzMessageService) {}

      ngOnInit(): void {
    this.fetchInstruments();


}



fetchInstruments(): void {
  this.loading = true;
  this.demande.getInstruments().subscribe({
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
      d.client.fullName.toLowerCase().includes(keyword) ||
      d.referenceInstrument.toLowerCase().includes(keyword) ||
      d.constructeur.toLowerCase().includes(keyword)
    );
  }



}
