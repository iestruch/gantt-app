import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GantHighchartsComponent } from './gant-highcharts.component';

describe('GantHighchartsComponent', () => {
  let component: GantHighchartsComponent;
  let fixture: ComponentFixture<GantHighchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GantHighchartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GantHighchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
