import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LatestExchangeRatesModel } from "../models/latest-exchange-rates.model";

@Injectable()
export class ExchangeRateCP {

    constructor(private http: HttpClient) { }

    getLatestRates$(): Observable<LatestExchangeRatesModel> {
        const url = environment.apiUrl;
        return this.http.get<LatestExchangeRatesModel>(url);
    }
}