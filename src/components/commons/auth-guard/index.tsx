"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import { getAccessToken, removeAccessToken } from "@/lib/auth";
import styles from "./styles.module.css";
import { access } from "fs";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const client = useApolloClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // 화면이 열린 뒤 저장된 토큰을 확인해요.
    const frameId = requestAnimationFrame(() => {
      setAccessToken(getAccessToken());
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const { data, error } = useQuery(FETCH_USER_LOGGED_IN, {
    skip: !accessToken,
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    // 토큰이 없거나 서버 검증에 실패하면 로그인 화면으로 이동해요.
    if (accessToken === "" || error) {
      removeAccessToken();
      void client.clearStore();
      router.replace("/login");
    }
  }, [accessToken, client, error, router]);

  if (!data) {
    return (
      <main className={styles.loading}>로그인 정보를 확인하고 있어요.</main>
    );
  }

  return children;
}
