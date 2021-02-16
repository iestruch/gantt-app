import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DevelopersService } from './developers/developers.service';
import { IssuesService } from './issues/issues.service';
import { ProjectsService } from './projects/projects.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<void> = new Subject<void>();
  issues: any[];
  developers: any[];
  projects: any[];
  teams: any[];
  teamSelected: string;
  chartData: any[];
  loading: boolean;
  planning: boolean;
  groupVariable: 'developers' | 'projects';
  updating: {
    enabled: boolean;
    value: any;
  };
  constructor(
    private route: Router,
    private issuesService: IssuesService,
    private developersService: DevelopersService,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.issues = [];
    this.developers = [];
    this.projects = [];
    this.teams = [];
    this.teamSelected = '0';
    this.chartData = [];
    this.loading = true;
    this.planning = false;
    this.groupVariable = 'developers'
    this.updating = {
      enabled: false,
      value: null
    };
    this.developersService.getDevelopers()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(({ data, loading }) => {
          const { developers } = data as any;
          this.developers = [...developers];
          this.teams = [...new Set(developers.map(dev => dev.team))];
        }),
        switchMap(() => this.projectsService.getProjects()),
        tap(({ data, loading }) => {
          const { projects } = data as any;
          this.projects = [...projects];
        }),
        switchMap(() => this.issuesService.getIssues()),
        tap(({ data, loading }) => {
          const { issues } = data as any;
          this.issues = [...issues];
        }),
        catchError((error) => {
          this.chartData = [];
          this.developers = [];
          this.issues = [];
          return of(error)
        })
      ).subscribe((data) => {
        if (data.error) {
          return;
        }

        this.createChartData();
      })
  }

  logout() {
    this.route.navigate(['login']);
  }

  teamChanged($event) {
    this.teamSelected = $event.value;
    this.chartData = [];
    setTimeout(() => {
      this.createChartData();
    }, 0)
  }

  createChartData() {
    if (this.groupVariable === 'developers') {
      this.chartData = [
        ...this.developers
          .filter((dev) => this.teamSelected === '0' ? dev : dev.team.id === this.teamSelected)
          .map((item) => ({ id: item.id, name: item.name })),

        ...this.issues
          .filter((issue) => this.teamSelected === '0' ? issue : issue.devId.team.id === this.teamSelected)
          .map((issue) => ({
            id: issue.id,
            name: `${issue.projectId.name} - ${issue.label}`,
            parent: issue.devId.id,
            start: (new Date(issue.startDate)).getTime(),
            end: new Date(issue.endDate).getTime()
          }))
      ];
    } else if (this.groupVariable === "projects") {
      this.chartData = [
        ...this.projects
          .map((item) => ({ id: item.id, name: item.name })),
        ...this.issues
          .filter((issue) => this.teamSelected === '0' ? issue : issue.devId.team.id === this.teamSelected)
          .map((issue) => ({
            id: issue.id,
            name: `${issue.devId.name} - ${issue.label}`,
            parent: issue.projectId.id,
            start: (new Date(issue.startDate)).getTime(),
            end: new Date(issue.endDate).getTime()
          }))
      ];
    }
  }

  invert() {
    this.loading = true;
    this.chartData = [];
    this.groupVariable = this.groupVariable === 'developers' ? 'projects' : 'developers';
    setTimeout(() => {
      this.loading = false;
      this.createChartData();
    },300)
    
  }

  addedPlan(value) {
    this.loading = true;
    this.planning = false;
    this.updating = { ...this.updating, enabled: false, value: null };
    if (!value) { return; }
    this.chartData = [];
    this.reloadIssues(this.teamSelected);
  }

  issueClicked($event) {
    const issue = this.issues.find(issue => issue.id === $event.id);
    if (!issue) { return; }
    this.updating = { ...this.updating, enabled: true, value: { ...issue } };
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  reloadIssues(teamFilter: string) {
    this.issuesService.getIssues()
      .pipe(
        catchError((error) => {
          this.chartData = [];
          this.developers = [];
          this.issues = [];
          return of(error)
        })
      ).subscribe(({ data }) => {
        if (data.error) {
          return;
        }

        const { issues } = data as any;

        setTimeout(() => {
          this.issues = [...issues];
          this.createChartData();
        }, 300)
      })
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
