import { Component } from '@angular/core';

@Component({
  selector: 'pathao-root',
  standalone: false,
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; height: 100%; }']
})
export class AppComponent {
  title = 'Pathao Driver';
}
