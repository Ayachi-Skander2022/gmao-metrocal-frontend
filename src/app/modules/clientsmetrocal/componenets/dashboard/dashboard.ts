import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone : true,
  imports: [ MatButtonModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  constructor(private snackbar: MatSnackBar) {}

  
  openSnackBar() {
    this.snackbar.open('Bonjour depuis Angular Material !', 'Fermer');
  }
  
}
