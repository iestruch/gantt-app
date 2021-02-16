import gql from "graphql-tag";

export const PROJECTS_QUERY = gql`
query {
  projects {
    id
    name
  }
}
`;
