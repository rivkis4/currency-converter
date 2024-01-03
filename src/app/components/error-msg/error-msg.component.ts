import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-error-msg',
  standalone: true,
  imports: [ MatDialogTitle, MatDialogContent ],
  templateUrl: './error-msg.component.html',
  styleUrl: './error-msg.component.scss'
})
export class ErrorMsgComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {}

}
