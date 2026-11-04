import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './form-detail.html',
  styleUrl: './form-detail.css'
})
export class FormDetailComponent implements OnInit {

  bookings = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading.set(true);

    const apiUrl = 'http://localhost:3000/api/bookings';

    this.http.get<any[]>(apiUrl)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (data) => {
          console.log('ข้อมูลจาก API:', data);
          this.bookings.set(data);
        },
        error: (err) => {
          console.error('โหลดข้อมูลผิดพลาด:', err);
        }
      });
  }
}