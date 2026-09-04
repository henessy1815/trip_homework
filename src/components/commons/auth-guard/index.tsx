"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import { useAuthStore } from "@/store/auth-store";
import styles from "./styles.module.css";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const client = useApolloClient();

  // Zustand에서 인증복구 준비 상태와 토큰과 로그아웃 함수 가져오기
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const { data, error } = useQuery(FETCH_USER_LOGGED_IN, {
    skip: !accessToken,
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    // 아직 토큰 복구 중일 때는 검사하지 않고 기다려요.
    if (!isAuthReady) return;
    // 토큰 복구가 완료되었는데도 토큰이 없거나 에러이면 로그인 화면으로 이동해요.
    if (accessToken === "" || error) {
      logout();
      void client.clearStore();
      router.replace("/login");
    }
  }, [isAuthReady, accessToken, client, error, logout, router]);

  // 아직 토큰 복구 중이거나 사용자 정보를 조회 중일때는 로딩 화면 유지
  if (!isAuthReady || !data) {
    return (
      <main className={styles.loading}>로그인 정보를 확인하고 있어요.</main>
    );
  }

  return children;
}
