import { Injectable } from "@angular/core";
import { ExchangeRateResultModel } from "../models/exchange-rate-item.model";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cacheKey = 'ExchangeRateQueue';

    enqueue<T>(item: T): void {
        const queue = this.getQueue<T>();
        queue.push(item);
        this.saveQueue(queue);

        if (queue.length > environment.maxItemsInCache) {
            this.dequeue<T>();
        }
    }

    dequeue<T>(): T | undefined {
        const queue = this.getQueue();
        const item = queue.shift() as T;
        this.saveQueue(queue);
        return item;
    }

    getQueue<T>(): T[] {
        const storedQueue = localStorage.getItem(this.cacheKey);
        return storedQueue ? JSON.parse(storedQueue) : [];
    }

    saveQueue<T>(queue: T[]): void {
        localStorage.setItem(this.cacheKey, JSON.stringify(queue));
    }

    clearQueue(): void {
        localStorage.removeItem(this.cacheKey);
    }
}