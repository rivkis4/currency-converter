import { Component, OnInit, effect } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ExchangeRateCP } from '../../services/exchange-rate.client-proxy';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ExchangeRateParamsModel } from '../../models/exchange-rate-params.model';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';

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
    ErrorMsgComponent
  ],
  providers: [
    ExchangeRateCP,
    ExchangeRateService,
    FormBuilder
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit {

  constructor(private service: ExchangeRateService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  rates: string[] = [];
  form!: FormGroup;
  result: string = "";

  ngOnInit(): void {
    this.service.load();
    this.form = this.fb.group({  
      fromRate: new FormControl('', Validators.required),
      toRate: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])  // Number with optional 2 decimal places
    });
  }

  latestRatesEffect = effect(() => {
    if (this.service.model()?.error) {
      this.dialog.open(
        ErrorMsgComponent,
        { data: this.service.model()?.error });

    } else { 
      const rates: { [key: string]: number }| undefined = this.service.model()?.rates!;
      if (rates) {
        this.rates = Object.keys(this.service.model()?.rates!);
      }
    }
  });

  calcExchangeRate() {
    const formValue: ExchangeRateParamsModel = this.form.value;
    const calcResult = this.service.calc(formValue);
    this.result = `${formValue.amount} ${formValue.fromRate} = ${calcResult} ${formValue.toRate}`
  }

}