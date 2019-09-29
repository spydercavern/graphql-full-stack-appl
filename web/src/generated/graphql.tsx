import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  accessToken: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  revokeRefreshTokenForUser: Scalars["Boolean"];
  register: Scalars["Boolean"];
  login: LoginResponse;
};

export type MutationRevokeRefreshTokenForUserArgs = {
  userId: Scalars["Int"];
};

export type MutationRegisterArgs = {
  password: Scalars["String"];
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  email: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  hello: Scalars["String"];
  bye: Scalars["String"];
  users: Array<User>;
};

export type User = {
  __typename?: "User";
  id: Scalars["Int"];
  email: Scalars["String"];
  tokenVersion: Scalars["Int"];
};
export type HelloQueryVariables = {};

export type HelloQuery = { __typename?: "Query" } & Pick<Query, "hello">;

export const HelloDocument = gql`
  query hello {
    hello
  }
`;

export function useHelloQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    HelloQuery,
    HelloQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<HelloQuery, HelloQueryVariables>(
    HelloDocument,
    baseOptions
  );
}
export function useHelloLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    HelloQuery,
    HelloQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<HelloQuery, HelloQueryVariables>(
    HelloDocument,
    baseOptions
  );
}

export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloQueryResult = ApolloReactCommon.QueryResult<
  HelloQuery,
  HelloQueryVariables
>;
