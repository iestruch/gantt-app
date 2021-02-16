import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { catchError, finalize, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { DevelopersService } from '../developers/developers.service';
import { ProjectsService } from '../projects/projects.service';
import { PlannerService } from './planner.service';
import { start } from 'repl';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit, OnDestroy {
  @Output() added: EventEmitter<void> = new EventEmitter<void>();
  fg: FormGroup;
  label: string;
  startDate: string;
  endDate: string;
  devId: string;
  projectId: string;
  developersCollection: { name: string, id: string }[];
  projectsCollection: { name: string, id: string }[];

  loading: boolean;
  creating: boolean;
  unsubscribe$: Subject<void> = new Subject<void>();
  error: string;
  constructor(
    private developersService: DevelopersService,
    private projectsService: ProjectsService,
    private plannerService: PlannerService
  ) { }

  ngOnInit(): void {
    this.fg = new FormGroup({});
    this.loading = true;
    this.initValues();
    this.developersService.getDevelopers()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(({ data, loading }) => this.developersCollection = [...(data as any).developers]),
        switchMap(() => this.projectsService.getProjects()),
        tap(({ data, loading }) => this.projectsCollection = [...(data as any).projects]),
        catchError((error) => {
          this.error = 'Error';
          return of({ error })
        }),
      ).subscribe((data) => {
        this.loading = false;
        if (data.error) {
          this.error = 'No hay datos';
          return;
        }

        this.fg = new FormGroup({
          label: new FormControl(this.label, { validators: [Validators.required] }),
          startDate: new FormControl(this.startDate),
          endDate: new FormControl(this.endDate),
          devId: new FormControl(this.devId, { validators: [Validators.required] }),
          projectId: new FormControl(this.projectId, { validators: [Validators.required] })
        });
      })
  }

  initValues(): void {
    this.startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en', null);
    this.endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en', null);
  }

  submit() {
    const { label, startDate, endDate, devId, projectId } = this.fg.value;
    this.creating = true;
    let _endDate;
    // In case startDate and endDate are equal ( we are not dealing with time...) just add 24 hours to 
    if (startDate === endDate) {
      _endDate = formatDate((new Date(endDate).getTime() + 24*60*60*1000), 'yyyy-MM-dd', 'en', null);
    } else {
      _endDate = endDate;
    }

    this.plannerService.createIssue(label, startDate, _endDate, devId, projectId)
      .pipe(
        catchError((error) => {
          this.error = error;
          return of({error})
        })
      )
      .subscribe((data) => {
        if (data.error) { return;}
        this.added.next(data);
      })
  }

  cancel() {
    this.added.next();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
