export interface ExchangeRateParamsModel {
    fromRate: string;
    toRate: string;
    amount: number;
}

export interface ExchangeRateResultModel extends ExchangeRateParamsModel {
    result: number;
}