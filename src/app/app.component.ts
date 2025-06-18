import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import { listOutline, star, starOutline } from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    addIcons({
      'list-outline': listOutline,
      'star-outline': starOutline,
      'star': star,
    });
  }
}