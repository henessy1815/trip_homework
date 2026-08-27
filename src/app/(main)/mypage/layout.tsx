import type { ReactNode } from "react";
import UserInfo from "@/components/mypage/user-info";
import styles from "./styles.module.css";

type MyPageLayoutProps = {
  children: ReactNode;
};

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>마이 페이지</h1>

      {/* 마이페이지의 위쪽 내 정보 영역은 모든 하위 페이지에서 함께 사용해요. */}
      <UserInfo />

      {/* 주소에 따라 아래 표 부분만 바뀌어요. */}
      <div className={styles.content}>{children}</div>
    </main>
  );
}
