import {Component} from '@angular/core';

@Component({
  selector: 'skm-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  date = new Date().setFullYear(1995);
  undef: Date;
}
