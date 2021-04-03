import gql from "graphql-tag";

export const DEVELOPERS_QUERY = gql`
query {
  developers {
    id
    name
    team {
      id
      name
    }
  }
}
`;
