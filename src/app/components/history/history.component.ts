import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { ExchangeRateResultModel } from '../../models/exchange-rate-item.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    RouterModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  constructor(private cacheService: CacheService,
    private router: Router) { }

  historyList: ExchangeRateResultModel[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.historyList = this.cacheService.getQueue<ExchangeRateResultModel>();
    this.historyList = this.historyList.reverse();
  }

  clear() {
    this.cacheService.clearQueue();
    this.load();
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

}
