"use client";

import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import type { User } from "@/types/user";
import styles from "./styles.module.css";

const getProfileUrl = (picture?: string | null) => {
  if (!picture) return "/icons/profile.svg";
  if (picture.startsWith("http") || picture.startsWith("/")) return picture;
  return `https://storage.googleapis.com/${picture}`;
};

export default function UserInfo() {
  const pathname = usePathname();
  const { data } = useQuery<{ fetchUserLoggedIn: User }>(FETCH_USER_LOGGED_IN, {
    ssr: false,
    fetchPolicy: "no-cache",
  });
  const user = data?.fetchUserLoggedIn;
  const profileUrl = getProfileUrl(user?.picture);

  const isPointPage = pathname.startsWith("/mypage/points");
  const isPasswordPage = pathname.startsWith("/mypage/password");
  const isProductPage = !isPointPage && !isPasswordPage;

  return (
    <section className={styles.infoBox}>
      <h2>내 정보</h2>

      <div className={styles.profileRow}>
        <span className={styles.profileImage}>
          <img
            src={profileUrl}
            alt="프로필"
            onError={(e) => {
              // 서버 사진이 깨졌을때 자동으로 기본 profile.svg로 교체
              e.currentTarget.src = "/icons/profile.svg";
            }}
          />
        </span>
        <span>{user?.name ?? "사용자"}</span>
      </div>

      <div className={styles.pointRow}>
        <Image src="/icons/point.svg" alt="포인트" width={20} height={20} />
        <strong>{(user?.userPoint?.amount ?? 0).toLocaleString()} P</strong>
      </div>

      <nav className={styles.menu}>
        <Link href="/mypage" className={isProductPage ? styles.activeMenu : ""}>
          <span>거래내역&amp;북마크</span>
          <Image
            src="/icons/right_arrow.svg"
            alt="이동"
            width={20}
            height={20}
          />
        </Link>

        <Link
          href="/mypage/points"
          className={isPointPage ? styles.activeMenu : ""}
        >
          <span>포인트 사용 내역</span>
          <Image
            src="/icons/right_arrow.svg"
            alt="이동"
            width={20}
            height={20}
          />
        </Link>

        <Link
          href="/mypage/password"
          className={isPasswordPage ? styles.activeMenu : ""}
        >
          <span>비밀번호 변경</span>
          <Image
            src="/icons/right_arrow.svg"
            alt="이동"
            width={20}
            height={20}
          />
        </Link>
      </nav>
    </section>
  );
}
