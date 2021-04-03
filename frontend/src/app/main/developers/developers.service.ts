import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HelpersService } from 'src/app/helpers/helpers.service';
import { DEVELOPERS_QUERY } from '../queries/developers.query';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {

  constructor(
    private apollo: Apollo
  ) { }

  getDevelopers():Observable<ApolloQueryResult<any[]>> {
    const {jwt} = HelpersService.getLocalStorageItem('user');
    return this.apollo
      .watchQuery<any[]>({
        query: DEVELOPERS_QUERY,
        context: {
          headers: {
            Authorization:
              `Bearer ${jwt}`,
          },
        }        
      }).valueChanges;
  }
}
