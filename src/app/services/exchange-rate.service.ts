import { Injectable, signal } from "@angular/core";
import { ExchangeRateCP } from "./exchange-rate.client-proxy";
import { LatestExchangeRatesModel } from "../models/latest-exchange-rates.model";
import { take } from "rxjs";
import { ExchangeRateParamsModel } from "../models/exchange-rate-params.model";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class ExchangeRateService {
    
    model = signal<LatestExchangeRatesModel | null>(null);

    constructor(private cp: ExchangeRateCP) { }

    load() {
        this.cp.getLatestRates$().pipe(take(1)).subscribe(result => {
            this.model.set(result);
        }, (error: HttpErrorResponse) => {
            this.model.set({
                error: error.status
            });
        });
    }

    calc(params: ExchangeRateParamsModel): number | null {
        const rates: { [key: string]: number } = this.model()?.rates!;

        if (!rates) return null;

        const fromRate = rates[params.fromRate];
        const toRate = rates[params.toRate];

        if (!fromRate || !toRate || params.amount == 0) {
            return null;
        }

        const exchangeFactor = toRate / fromRate;
        const secondAmount = params.amount * exchangeFactor;
    
        // Round the result to a reasonable number of decimal places
        return Math.round(secondAmount * 100) / 100;
    }

}