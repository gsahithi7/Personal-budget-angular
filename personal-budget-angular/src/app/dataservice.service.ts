import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  private data: any[] = []; // The variable to store the fetched data
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  fetchDataIfNeeded(): void {
    if (this.data.length === 0) {
      this.http.get('http://localhost:3000/budget').subscribe((response: any) => {
        this.data = response.expenses.expenses; // Store the fetched data
        this.dataSubject.next(this.data); // Update the BehaviorSubject
      });
    }
  }

  getData(): Observable<any[]> {
    return this.dataSubject.asObservable();
  }
}
