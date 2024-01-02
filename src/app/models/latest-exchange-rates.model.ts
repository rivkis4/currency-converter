export class LatestExchangeRatesModel {
    success?: boolean;
    timestamp?: string;
    base?: string;
    date?: Date;
    rates?: { [key: string]: number };
}