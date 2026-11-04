import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}  
