"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import type { User } from "@/types/user";
import styles from "./styles.module.css";

export default function Header() {
  const client = useApolloClient();
  const pathname = usePathname();
  const router = useRouter();

  // 처음 state를 만들 때 브라우저에 저장된 토큰을 한 번 읽어요.
  const [accessToken, setAccessToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("accessToken") ?? "";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data } = useQuery<{ fetchUserLoggedIn: User }>(FETCH_USER_LOGGED_IN, {
    skip: accessToken === "",
    ssr: false,
  });

  const onClickLogout = async () => {
    // 저장했던 토큰과 Apollo에 남아 있는 로그인 정보를 함께 지워요.
    localStorage.removeItem("accessToken");
    setAccessToken("");
    await client.clearStore();
    router.push("/");
  };

  const user = data?.fetchUserLoggedIn;
  const point = user?.userPoint?.amount ?? 0;
  const isTripTalkPage = pathname === "/" || pathname.startsWith("/boards");
  const isTravelProductsPage = pathname.startsWith("/travelproducts");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="TripTrip 홈">
          {/* public 폴더의 파일은 /파일이름으로 바로 사용할 수 있어요. */}
          <img src="/triptrip.png" alt="TripTrip" />
        </Link>

        <nav className={styles.navigation} aria-label="주요 메뉴">
          <Link className={isTripTalkPage ? styles.active : ""} href="/">
            트립토크
          </Link>
          {/* 숙박권 구매는 이번 주에 화면부터 천천히 채워 갈 빈 페이지예요. */}
          <Link
            className={isTravelProductsPage ? styles.active : ""}
            href="/travelproducts"
          >
            숙박권 구매
          </Link>
          <span>마이 페이지</span>
        </nav>

        {accessToken === "" ? (
          <Link className={styles.loginButton} href="/login">
            로그인 <span>›</span>
          </Link>
        ) : (
          <div className={styles.profileArea}>
            <button
              className={styles.profileButton}
              type="button"
              aria-expanded={isMenuOpen}
              aria-label="프로필 메뉴 열기"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className={styles.profileAvatar}>👤</span>
              <span className={styles.profileArrow}>
                {isMenuOpen ? "▴" : "▾"}
              </span>
            </button>

            {isMenuOpen && (
              <div className={styles.profileMenu}>
                <button
                  className={styles.menuTop}
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.menuAvatar}>👤</span>
                  <strong>{user?.name ?? "로그인 사용자"}</strong>
                  <span className={styles.menuArrow}>▴</span>
                </button>

                <div className={styles.menuRow}>
                  <span className={styles.menuIcon}>▣</span>
                  <strong>{point.toLocaleString()} P</strong>
                </div>

                <button className={styles.menuRow} type="button">
                  <span className={styles.menuIcon}>⚡</span>
                  포인트 충전
                </button>

                <button
                  className={styles.menuRow}
                  type="button"
                  onClick={onClickLogout}
                >
                  <span className={styles.menuIcon}>↪</span>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
