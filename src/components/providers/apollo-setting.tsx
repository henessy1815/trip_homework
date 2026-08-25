"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import type { ReactNode } from "react";

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
  // 로그인 후 저장한 accessToken을 매 API 요청에 넣어요.
  const accessToken =
    typeof window === "undefined" ? "" : localStorage.getItem("accessToken");

  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

type ApolloSettingProps = {
  children: ReactNode;
};

export default function ApolloSetting({ children }: ApolloSettingProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
