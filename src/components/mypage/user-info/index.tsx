"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.css";

export default function UserInfo() {
  const pathname = usePathname();

  const isPointPage = pathname.startsWith("/mypage/points");
  const isPasswordPage = pathname.startsWith("/mypage/password");
  const isProductPage = !isPointPage && !isPasswordPage;

  return (
    <section className={styles.infoBox}>
      <h2>내 정보</h2>

      <div className={styles.profileRow}>
        <span className={styles.profileImage}>
          <Image src="/icons/person.svg" alt="프로필" width={26} height={26} />
        </span>
        <span>김남일</span>
      </div>

      <div className={styles.pointRow}>
        <Image src="/icons/point.svg" alt="포인트" width={20} height={20} />
        <strong>23,000 P</strong>
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
