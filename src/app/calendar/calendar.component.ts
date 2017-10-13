import {Component, Input, OnInit} from '@angular/core';
import {startOfToday, format} from 'date-fns';

@Component({
  selector: 'tb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() today = format(startOfToday(), 'DD-MM-YYYY');

  ngOnInit() {
  }

}
