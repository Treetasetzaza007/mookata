import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class FormComponent {
  formData = {
    firstName: '',
    lastName: '',
    date: '',
    time: '' // เพิ่มช่องเวลาตามที่สร้างในฐานข้อมูล
  };
  
  // เพิ่มตัวแปรสำหรับล็อคปุ่ม
  isSubmitting = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // 1. ดักจับชื่อ ภัทราภรณ์ พลเดช ไว้เป็นอันดับแรก
    if (this.formData.firstName === 'ภัทราภรณ์' && this.formData.lastName === 'พลเดช') {
      alert('ขออภัยคุณอยู่หนองคายมากินไม่ได้');
      return; // ใช้ return เพื่อหยุดการทำงานตรงนี้เลย ข้อมูลจะไม่ถูกส่งไปบันทึก
    }

    // 2. ถ้าไม่ใช่ชื่อข้างบน ก็ทำงานตามปกติ
    if (this.formData.firstName && this.formData.lastName && this.formData.date) {
      
      this.isSubmitting = true; 

      const apiUrl = 'http://localhost:3000/api/bookings'; 
      
      this.http.post(apiUrl, this.formData).subscribe({
        next: (res) => {
          alert('✅ บันทึกข้อมูลจองโต๊ะสำเร็จ!'); 
          this.router.navigate(['/form-detail']);
        },
        error: (err) => {
          alert('❌ เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่');
          this.isSubmitting = false; 
        }
      });
      
    } else {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}