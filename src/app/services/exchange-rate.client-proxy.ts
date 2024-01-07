import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LatestExchangeRatesModel } from "../models/latest-exchange-rates.model";
import { SymbolsModel } from "../models/symbols.model";

@Injectable()
export class ExchangeRateCP {

    constructor(private http: HttpClient) { }

    getSymbols$(): Observable<SymbolsModel> {
        const url = `${environment.hostName}symbols?access_key=${environment.accessKey}`;
        return this.http.get<SymbolsModel>(url);
    }

    getLatestRates$(fromRate: string, toRate: string): Observable<LatestExchangeRatesModel> {
        const url = `${environment.hostName}latest?access_key=${environment.accessKey}&format=1&symbols=${fromRate},${toRate}`;
        return this.http.get<LatestExchangeRatesModel>(url);
    }
}