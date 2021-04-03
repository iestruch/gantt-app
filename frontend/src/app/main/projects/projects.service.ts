import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HelpersService } from 'src/app/helpers/helpers.service';
import { Observable } from 'rxjs';
import { PROJECTS_QUERY } from '../queries/projects.query';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private apollo: Apollo
  ) { }

  getProjects(): Observable<ApolloQueryResult<any>> {
    const {jwt} = HelpersService.getLocalStorageItem('user');
    return this.apollo
      .watchQuery<any[]>({
        query: PROJECTS_QUERY,
        context: {
          headers: {
            Authorization:
              `Bearer ${jwt}`,
          },
        }        
      }).valueChanges;

  }
}
