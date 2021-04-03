import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Apollo } from "apollo-angular";

import gql from "graphql-tag";

export const USER_LOGIN_QUERY = gql`
mutation login($identifier: String!, $password: String!){
  login(input: { identifier: $identifier, password: $password }) {
    jwt
    user {
      id,
      username,
      email,
      blocked,
      confirmed,
      role {
        name,
        id
      }
    }
  }
}
`;


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private apollo: Apollo
  ) { }

  login(identifier, password): Observable<any> {
    return this.apollo
      .mutate({
        mutation: USER_LOGIN_QUERY,
        variables: {
          identifier, password
        }
      })
  }
}
