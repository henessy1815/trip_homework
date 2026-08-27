"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import type { User } from "@/types/user";
import styles from "./styles.module.css";

export default function Header() {
  const client = useApolloClient();
  const pathname = usePathname();
  const router = useRouter();

  // 서버에는 localStorage가 없으므로 처음에는 로그아웃 상태로 시작해요.
  const [accessToken, setAccessToken] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 화면이 브라우저에 나타난 다음 저장된 토큰을 확인해요.
    // 이렇게 하면 서버 화면과 브라우저의 첫 화면이 달라지는 오류를 막을 수 있어요.
    const frameId = requestAnimationFrame(() => {
      const savedAccessToken = localStorage.getItem("accessToken") ?? "";
      setAccessToken(savedAccessToken);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

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

        {accessToken === "" ? (
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
                <Image src="/icons/person.svg" alt="" width={24} height={24} />
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
                    <Image
                      src="/icons/person.svg"
                      alt=""
                      width={24}
                      height={24}
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
