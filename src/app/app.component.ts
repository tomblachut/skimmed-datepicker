import {Component} from '@angular/core';

@Component({
  selector: 'tb-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  date = new Date();

  changeDate($event) {
    this.date = $event;
  }
}
