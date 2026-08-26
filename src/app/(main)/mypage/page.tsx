import styles from "./styles.module.css";

export default function MyPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>마이 페이지</h1>

      {/* 1. 상단: 내 정보 카드 영역 */}
      <section className={styles.profileSection}>
        {/* 4단계에서 작성할 내 정보 상세 UI */}
        <div className={styles.tempBox}>상단: 내 정보 카드 영역</div>
      </section>

      {/* 2. 하단: 목록 및 탭 영역 */}
      <section className={styles.contentSection}>
        {/* 5단계에서 작성할 탭, 검색바, 테이블 UI */}
        <div className={styles.tempBox}>
          하단: 탭 / 검색바 / 상품 목록 테이블 영역
        </div>
      </section>
    </main>
  );
}
