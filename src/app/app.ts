import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

interface SampleData {
  id: number;
  name: string;
  age: number;
  city: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ngDuckDb - Angular 20 with DuckDB');
  protected readonly data = signal<SampleData[]>([]);
  protected readonly loading = signal(false);
  protected readonly message = signal('');
  protected readonly displayedColumns = ['id', 'name', 'age', 'city'];

  private worker: Worker | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./duckdb.worker', import.meta.url), {
        type: 'module'
      });

      this.worker.onmessage = ({ data }) => {
        this.loading.set(false);
        if (data.success) {
          if (data.data) {
            this.data.set(data.data);
            this.message.set('Data loaded successfully!');
          } else {
            this.message.set(data.message || 'Operation completed successfully!');
          }
        } else {
          this.message.set(`Error: ${data.error}`);
        }
      };

      this.worker.onerror = (error) => {
        this.loading.set(false);
        this.message.set(`Worker error: ${error.message}`);
      };
    } else {
      this.message.set('Web Workers are not supported in this environment.');
    }
  }

  protected insertData(): void {
    if (!this.worker) return;
    
    this.loading.set(true);
    this.message.set('Inserting data...');
    this.worker.postMessage({ action: 'insert' });
  }

  protected loadData(): void {
    if (!this.worker) return;
    
    this.loading.set(true);
    this.message.set('Loading data...');
    this.worker.postMessage({ action: 'load' });
  }
}
