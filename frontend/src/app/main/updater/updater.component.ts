import { formatDate } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DevelopersService } from '../developers/developers.service';
import { PlannerComponent } from '../planner/planner.component';
import { PlannerService } from '../planner/planner.service';
import { ProjectsService } from '../projects/projects.service';
import { UpdaterService } from './updater.service';

@Component({
  selector: 'app-updater',
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent extends PlannerComponent {
  @Input() data: any;

  removing: boolean;
  constructor(
    developersService: DevelopersService,
    projectsService: ProjectsService,
    plannerService: PlannerService,
    private updaterService: UpdaterService
  ) {
    super(developersService, projectsService, plannerService);
  }

  id: string;

  initValues(): void {
    this.id = this.data.id;
    this.label = this.data.label;
    this.startDate = this.data.startDate;
    this.endDate = this.data.endDate;
    this.devId = this.data.devId.id;
    this.projectId = this.data.projectId.id;

    this.removing = false;
  }

  submit() {
    const { label, startDate, endDate, devId, projectId } = this.fg.value;
    this.creating = true;
    let _endDate;
    // In case startDate and endDate are equal ( we are not dealing with time...) just add 1 day
    if (startDate === endDate) {
      _endDate = formatDate((new Date(endDate).getTime() + 24*60*60*1000), 'yyyy-MM-dd', 'en', null);
    } else {
      _endDate = endDate;
    }
    this.updaterService.updateIssue(this.id, label, startDate, _endDate, devId, projectId)
      .pipe(
        catchError((error) => {
          this.error = error;
          return of({error});
        })
      )
      .subscribe((data) => {
        if (data.error) { return;}
        this.added.next(data);
      })
  }

  remove() {
    this.creating = true;
    this.updaterService.deleteIssue(this.id)
      .pipe(
        catchError((error) => {
          this.error = error;
          return of({error});
        })
      )
      .subscribe((data) => {
        if (data.error) { return;}
        this.added.next(data);
      })
  }

}
