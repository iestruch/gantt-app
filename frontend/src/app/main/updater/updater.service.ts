import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { Apollo } from "apollo-angular";

import gql from "graphql-tag";
import { HelpersService } from 'src/app/helpers/helpers.service';

export const ISSUE_UPDATE_MUTATION = gql`
mutation updateIssue($id: ID!, $label: String!, $startDate: Date!, $endDate: Date!, $devId: ID!, $projectId: ID!){
  updateIssue(input: {
    where: {id: $id}
    data: {label: $label, startDate: $startDate, endDate: $endDate, devId: $devId, projectId: $projectId}
  }) {
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

export const ISSUE_DELETE_MUTATION = gql`
mutation deleteIssue($id: ID!){
  deleteIssue(input: {
    where: {id: $id}
  }) {
    issue {
      id
    }
  }
}
`;


@Injectable({
  providedIn: 'root'
})
export class UpdaterService {

  constructor(
    private apollo: Apollo
  ) { }


  updateIssue(id: string, label: string, startDate: string, endDate: string, devId: string, projectId: string): Observable<any> {
    const {jwt} = HelpersService.getLocalStorageItem('user');
    return this.apollo.mutate({
      mutation: ISSUE_UPDATE_MUTATION,
      variables: {
        id, label, startDate, endDate, devId, projectId
      },
      context: {
        headers: {
          Authorization:
            `Bearer ${jwt}`,
        },
      }
    })
  }

  deleteIssue(id: string): Observable<any> {
    const {jwt} = HelpersService.getLocalStorageItem('user');
    return this.apollo.mutate({
      mutation: ISSUE_DELETE_MUTATION,
      variables: {
        id
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
