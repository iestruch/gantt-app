import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { Apollo } from "apollo-angular";

import gql from "graphql-tag";
import { HelpersService } from 'src/app/helpers/helpers.service';

export const ISSUE_CREATION_MUTATION = gql`
mutation createIssue($label: String, $startDate: Date, $endDate: Date, $devId: ID, $projectId: ID){
  createIssue(input: {data: {label: $label, startDate: $startDate, endDate: $endDate, devId: $devId, projectId: $projectId}}) {
    issue {
      id
      label
      devId {
        name
        id
      }
      projectId {
        name
        id
      }
      startDate
      endDate
    }
  }
}
`;


@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  constructor(
    private apollo: Apollo
  ) { }

  createIssue(label: string, startDate: string, endDate: string, devId: string, projectId: string): Observable<any> {
    const {jwt} = HelpersService.getLocalStorageItem('user');
    return this.apollo.mutate({
      mutation: ISSUE_CREATION_MUTATION,
      variables: {
        label, startDate, endDate, devId, projectId
      },
      context: {
        headers: {
          Authorization:
            `Bearer ${jwt}`,
        },
      }
    })
  }
}
