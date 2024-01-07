import { Injectable, signal } from "@angular/core";
import { ExchangeRateCP } from "./exchange-rate.client-proxy";
import { LatestExchangeRatesModel } from "../models/latest-exchange-rates.model";
import { Observable, map, take, tap } from "rxjs";
import { ExchangeRateParamsModel, ExchangeRateResultModel } from "../models/exchange-rate-item.model";
import { HttpErrorResponse } from "@angular/common/http";
import { SymbolsModel } from "../models/symbols.model";
import { CacheService } from "./cache.service";

@Injectable()
export class ExchangeRateService {

    symbols!: SymbolsModel;

    constructor(private cp: ExchangeRateCP,
        private cacheService: CacheService) { }

    loadSymbols$(): Observable<SymbolsModel> {
        return this.cp.getSymbols$().pipe(tap(result => {
            this.symbols = result;
        }));
    }

    calc$(params: ExchangeRateParamsModel): Observable<ExchangeRateResultModel | null> {
        return this.cp.getLatestRates$(params.fromRate, params.toRate).pipe(map(result => {

            if (!(result.success == true) || !result.rates) return null;

            const fromRate: number = result.rates![params.fromRate];
            const toRate: number = result.rates![params.toRate];

            if (!fromRate || !toRate || params.amount == 0) {
                return null;
            }

            const exchangeFactor = toRate / fromRate;
            const secondAmount = params.amount * exchangeFactor;

            // Round the result to a reasonable number of decimal places
            const calcResult = Math.round(secondAmount * 100) / 100;

            const resultModel: ExchangeRateResultModel = {
                ...params,
                result: calcResult!
            };

            this.cacheService.enqueue<ExchangeRateResultModel>(resultModel);

            return resultModel;
        }));
    }

}