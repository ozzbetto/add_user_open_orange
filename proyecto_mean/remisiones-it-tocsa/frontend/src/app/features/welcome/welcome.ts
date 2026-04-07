import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CardModule, ButtonModule, RouterLink],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class Welcome { }