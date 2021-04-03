import gql from "graphql-tag";

export const ISSUES_QUERY = gql`
query {
    issues {
      id
      label
      devId {
        name
        id
        team {
          id
          name
        }
      }
      projectId {
        name
        id
      }
      startDate
      endDate
    }
  }
`;


export const ISSUES_QUERY_BY_TEAM = gql`
query getIssues($team: String) {
  getIssues(input:{data:{developer: {team:$team}}}) {
    issues {
      id
      label
      devId {
        name
        id
        team
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
