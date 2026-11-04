import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FormComponent } from './form/form';
import { FormDetailComponent } from './form-detail/form-detail';

export const routes: Routes = [
  { path: '', component: FormComponent },
  { path: 'home', component: Home },
  { path: 'form', component: FormComponent },
  { path: 'form-detail', component: FormDetailComponent },
  { path: '**', redirectTo: '' } // ถ้าพิมพ์ผิดให้กลับมาหน้าแรก
];