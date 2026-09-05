"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types/user";
import styles from "./styles.module.css";

const getProfileUrl = (picture?: string | null) => {
  if (!picture) return "/icons/profile.svg";
  if (picture.startsWith("/")) return picture;
  return `https://storage.googleapis.com/${picture}`;
};

export default function Header() {
  const client = useApolloClient();
  const pathname = usePathname();
  const router = useRouter();

  // isAuthReady 추가 가져오기
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  // Zustand Store에서 로그인 토큰과 로그아웃 함수 가져오기
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 로그인 사용자 정보 조회
  const { data, error } = useQuery<{ fetchUserLoggedIn: User }>(
    FETCH_USER_LOGGED_IN,
    {
      skip: accessToken === "",
      fetchPolicy: "no-cache",
    },
  );

  // 토큰 오류 시 자동 로그아웃 처리
  useEffect(() => {
    if (!error) return;
    logout();
    void client.clearStore();
  }, [client, error, logout]);

  // 로그아웃 버튼 클릭 핸들러
  const onClickLogout = async () => {
    logout(); // Zustand Store 토큰 비우기
    setIsMenuOpen(false);
    await client.clearStore(); // Apollo 캐시 초기화
    router.push("/");
  };

  const user = data?.fetchUserLoggedIn;
  const point = user?.userPoint?.amount ?? 0;
  const profileUrl = getProfileUrl(user?.picture);
  const isTripTalkPage = pathname === "/" || pathname.startsWith("/boards");
  const isTravelProductsPage = pathname.startsWith("/travelproducts");
  const isMyPage = pathname.startsWith("/mypage");

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
          <Link className={isMyPage ? styles.active : ""} href="/mypage">
            마이 페이지
          </Link>
        </nav>

        {!isAuthReady ? (
          <div style={{ width: 80 }} />
        ) : accessToken === "" ? (
          <Link className={styles.loginButton} href="/login">
            로그인
            <Image
              className={styles.loginArrow}
              src="/icons/right_arrow.svg"
              alt=""
              width={18}
              height={18}
            />
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
              <span className={styles.profileAvatar}>
                <img
                  src={profileUrl}
                  alt={user?.name ?? "프로필"}
                  onError={(e) => {
                    e.currentTarget.src = "/icons/profile.svg";
                  }}
                />
              </span>
              <Image
                className={styles.profileArrow}
                src={
                  isMenuOpen ? "/icons/up_arrow.svg" : "/icons/down_arrow.svg"
                }
                alt=""
                width={14}
                height={14}
              />
            </button>

            {isMenuOpen && (
              <div className={styles.profileMenu}>
                <button
                  className={styles.menuTop}
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.menuAvatar}>
                    <img
                      src={profileUrl}
                      alt={user?.name ?? "프로필"}
                      onError={(e) => {
                        e.currentTarget.src = "/icons/profile.svg";
                      }}
                    />
                  </span>
                  <strong>{user?.name ?? "로그인 사용자"}</strong>
                  <Image
                    className={styles.menuArrow}
                    src="/icons/up_arrow.svg"
                    alt=""
                    width={14}
                    height={14}
                  />
                </button>

                <div className={styles.menuRow}>
                  <span className={styles.menuIcon}>
                    <Image
                      src="/icons/point.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                  <strong>{point.toLocaleString()} P</strong>
                </div>

                <button className={styles.menuRow} type="button">
                  <span className={styles.menuIcon}>
                    <Image
                      src="/icons/charge.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                  포인트 충전
                </button>

                <button
                  className={styles.menuRow}
                  type="button"
                  onClick={onClickLogout}
                >
                  <span className={styles.menuIcon}>
                    <Image
                      src="/icons/logout.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
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
