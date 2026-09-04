"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ApolloProvider, useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { RESTORE_ACCESS_TOKEN } from "@/graphql/mutations";
import { useAuthStore } from "@/store/auth-store";

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include", // 쿠키를 주고받기 위해 필수
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = useAuthStore.getState().accessToken;

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

// 새로고침 시 refresh token 쿠키로 access token을 복구하는 내부 컴포넌트
function AuthRestore({ children }: { children: ReactNode }) {
  const [restoreAccessToken] = useMutation(RESTORE_ACCESS_TOKEN);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const finishAuth = useAuthStore((state) => state.finishAuth);

  useEffect(() => {
    const restore = async () => {
      try {
        // 서버에 쿠키와 함께 토큰 재발급 요청
        const result = await restoreAccessToken();
        const newToken = result.data?.restoreAccessToken.accessToken;

        if (newToken) {
          setAccessToken(newToken); // Zustand에 복구된 토큰 저장
        }
      } catch {
        setAccessToken(""); // 쿠키가 없거나 만료된 경우
      } finally {
        finishAuth(); // 인증 준비 완료 (isAuthReady = true)
      }
    };

    void restore();
  }, [restoreAccessToken, setAccessToken, finishAuth]);

  return <>{children}</>;
}

type ApolloSettingProps = {
  children: ReactNode;
};

export default function ApolloSetting({ children }: ApolloSettingProps) {
  return (
    <ApolloProvider client={client}>
      <AuthRestore>{children}</AuthRestore>
    </ApolloProvider>
  );
}
