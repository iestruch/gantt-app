import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from "apollo-angular";
import { ISSUES_QUERY } from '../queries/issues.query';
import { Observable } from 'rxjs';
import { HelpersService } from 'src/app/helpers/helpers.service';


@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(
    private apollo: Apollo
  ) { }

  getIssues():Observable<ApolloQueryResult<any[]>> {
    const {jwt} = HelpersService.getLocalStorageItem('user');
    return this.apollo
      .watchQuery<any[]>({
        query: ISSUES_QUERY,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization:
              `Bearer ${jwt}`,
          },
        }        
      }).valueChanges;
  }
}
