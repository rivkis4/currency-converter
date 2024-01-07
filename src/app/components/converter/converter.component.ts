import { Component, OnInit, effect } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeRateParamsModel } from '../../models/exchange-rate-item.model';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';
import { ExchangeRateResultModel } from '../../models/exchange-rate-item.model';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'converter',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    ErrorMsgComponent,
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatProgressBarModule
  ],
  providers: [
    FormBuilder
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit {

  constructor(private service: ExchangeRateService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router) { }

  symbols!: { [key: string]: string }[] | undefined;
  form!: FormGroup;
  result!: ExchangeRateResultModel;
  isLoading: boolean = false;

  ngOnInit(): void {
    if (this.service.symbols?.symbols) {
      this.symbols = this.service.symbols.symbols;

    } else {
      this.isLoading = true;

      this.service.loadSymbols$().pipe(take(1)).subscribe({
        next: result => {
          this.isLoading = false;

          if (result.success == true && result.symbols) {
            this.symbols = result.symbols;

          } else {
            this.dialog.open(
              ErrorMsgComponent);
          }
        },

        error: (error: HttpErrorResponse) => {
          this.isLoading = false;

          this.dialog.open(
            ErrorMsgComponent,
            { data: error.status });
        }
      });
    }

    this.form = this.fb.group({
      fromRate: new FormControl('', Validators.required),
      toRate: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(0.0000001)])
    });
  }

  calcExchangeRate() {
    this.isLoading = true;

    const formValue: ExchangeRateParamsModel = this.form.value;
    this.service.calc$(formValue).pipe(take(1)).subscribe({
      next: resultModel => {
        this.isLoading = false;

        if (resultModel) {
          this.result = resultModel;

        } else {
          this.dialog.open(
            ErrorMsgComponent);
        }

      },

      error: ((error: HttpErrorResponse) => {
        this.isLoading = false;

        this.dialog.open(
          ErrorMsgComponent,
          { data: error.status });
      })
    });
  }

  navigateHistory() {
    this.router.navigate(['/history']);
  }


}