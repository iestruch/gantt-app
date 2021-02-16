import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as HighchartsGant from 'highcharts/highcharts-gantt';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-gant-highcharts',
  templateUrl: './gant-highcharts.component.html',
  styleUrls: ['./gant-highcharts.component.scss']
})
export class GantHighchartsComponent implements OnInit, AfterViewInit {
  @Input() data: any[];
  @Input() config: any;
  @Output() serieClicked: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('highchartsContainer', { static: false }) hcContainer;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    HighchartsGant.ganttChart(this.hcContainer.nativeElement as HTMLElement, {
      title: {
        text: null
      },
      chart: { renderTo: this.hcContainer.nativeElement as HTMLElement },
      series: [
        {
          name: 'Project 1',
          type: 'gantt',
          data: this.data ? [...this.data] : [],
          events: {
            click: ((serie, context) => { 
              const item = serie.point.options;
              this.serieClicked.next(item);
            }) as HighchartsGant.SeriesClickCallbackFunction
          }
        }]
    });
  }


}
