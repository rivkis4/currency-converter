import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { ExchangeRateResultModel } from '../../models/exchange-rate-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  constructor(private cacheService: CacheService) { }
  
  historyList: ExchangeRateResultModel[] = [];

  ngOnInit(): void {
    this.historyList = this.cacheService.getQueue<ExchangeRateResultModel>();
    this.historyList = this.historyList.reverse();
  }
}
