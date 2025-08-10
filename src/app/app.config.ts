import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';



import { ApartmentOutline, ArrowDownOutline, ArrowUpOutline, BellOutline, BuildOutline, ClockCircleOutline, ContainerOutline, DotChartOutline, HistoryOutline, LineChartOutline, LockOutline, NumberOutline, OrderedListOutline, PhoneOutline, SendOutline, SolutionOutline, SyncOutline, UpOutline, UserOutline, WarningOutline } from '@ant-design/icons-angular/icons';
import { LoginOutline } from '@ant-design/icons-angular/icons';


// Importer le module ngx-charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { IdcardOutline } from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';

import { importProvidersFrom } from '@angular/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';


import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
registerLocaleData(fr);

import { fr_FR, NZ_I18N } from 'ng-zorro-antd/i18n';



import {
  HomeOutline,
  TeamOutline,
  UserAddOutline,
  FileTextOutline,
  ToolOutline,
  CheckSquareOutline,
  BarChartOutline,
  FileOutline,
  SettingOutline,
  MailOutline,
    CheckCircleTwoTone,
  CloseCircleTwoTone,
  LogoutOutline,
  SearchOutline,
  CalendarOutline,
  PlusCircleOutline,
  EyeOutline,
  EditOutline,
  DeleteOutline,
  DownloadOutline,
  UploadOutline,
} from '@ant-design/icons-angular/icons';

export const appConfig : ApplicationConfig = {


  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    provideAnimations(),
    
    { provide: NZ_I18N, useValue: fr_FR },
     provideRouter(routes),

        importProvidersFrom(MatSnackBarModule),

      provideNzIcons([HomeOutline,
  TeamOutline,
  UserAddOutline,
  OrderedListOutline,
  SyncOutline,
  
  ContainerOutline,

   CheckCircleTwoTone,
  CloseCircleTwoTone,

  DotChartOutline,
  ClockCircleOutline,

  LineChartOutline,


  HomeOutline,
  CalendarOutline,
  EditOutline,
  UserOutline,
  LogoutOutline,
  BellOutline,

  WarningOutline,

  SolutionOutline,

  ArrowUpOutline,
   ArrowDownOutline,

  SendOutline,

  PhoneOutline,
  ApartmentOutline,

  NumberOutline,

  HistoryOutline,

  IdcardOutline,
  LoginOutline,
  LockOutline,
  UserOutline,
  LogoutOutline ,
  FileTextOutline,
  ToolOutline,
  BuildOutline,
  SettingOutline,
  CheckSquareOutline,
  BarChartOutline,
  FileOutline,
  SettingOutline,
  MailOutline,
  LogoutOutline,
  SearchOutline,
  CalendarOutline,
  PlusCircleOutline,
  EyeOutline,
  EditOutline,
  DeleteOutline,
  DownloadOutline,
  UploadOutline]),
  ]
};
