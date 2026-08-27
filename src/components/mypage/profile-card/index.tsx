"use client";

import { useState } from "react";
import styles from "./styles.module.css";

// 나중에 상위에서 로그인 유저 데이터를 props로 넘겨받을 수 있도록 타입을 정의해둡니다.
type ProfileCardProps = {
  name?: string;
  point?: number;
  profileImage?: string;
};

export default function ProfileCard({
  name = "김남일",
  point = 25000,
  profileImage,
}: ProfileCardProps) {
  // 현재 선택된 서브 메뉴 (기본값: 거래내역&북마크)
  const [activeMenu, setActiveMenu] = useState<
    "transactions" | "points" | "password"
  >("transactions");

  return (
    <div className={styles.card}>
      {/* 1. 상단 타이틀 */}
      <h2 className={styles.title}>내 정보</h2>

      {/* 2. 프로필 (아바타 + 이름) */}
      <div className={styles.profileArea}>
        <div className={styles.avatar}>
          {profileImage ? (
            <img src={profileImage} alt={name} />
          ) : (
            <span className={styles.avatarDefault}>👤</span>
          )}
        </div>
        <span className={styles.userName}>{name}</span>
      </div>

      {/* 3. 포인트 정보 */}
      <div className={styles.pointArea}>
        <span className={styles.pointIcon}>💳</span>
        <strong className={styles.pointAmount}>
          {point.toLocaleString()} P
        </strong>
      </div>

      {/* 4. 구분선 */}
      <hr className={styles.divider} />

      {/* 5. 메뉴 목록 */}
      <div className={styles.menuList}>
        <button
          type="button"
          className={`${styles.menuItem} ${activeMenu === "transactions" ? styles.active : ""}`}
          onClick={() => setActiveMenu("transactions")}
        >
          <span>거래내역&북마크</span>
          <span className={styles.arrow}>›</span>
        </button>

        <button
          type="button"
          className={`${styles.menuItem} ${activeMenu === "points" ? styles.active : ""}`}
          onClick={() => setActiveMenu("points")}
        >
          <span>포인트 사용 내역</span>
          <span className={styles.arrow}>›</span>
        </button>

        <button
          type="button"
          className={`${styles.menuItem} ${activeMenu === "password" ? styles.active : ""}`}
          onClick={() => setActiveMenu("password")}
        >
          <span>비밀번호 변경</span>
          <span className={styles.arrow}>›</span>
        </button>
      </div>
    </div>
  );
}
