import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

type ProductHistoryProps = {
  activeTab: "mine" | "bookmarks";
};

// 아직 API를 연결하지 않았으므로 화면 확인용 상품을 배열에 적어 두었어요.
const products = [
  { id: 243, title: "파라다이스 호텔 제주", price: "326,000원", isSold: true },
  { id: 242, title: "포항 오션뷰 숙박권", price: "326,000원", isSold: false },
  {
    id: 241,
    title: "강릉 바다가 보이는 숙소",
    price: "326,000원",
    isSold: true,
  },
  { id: 240, title: "서울 도심 호캉스", price: "326,000원", isSold: true },
  { id: 239, title: "제주 감성 독채 숙소", price: "326,000원", isSold: false },
  { id: 238, title: "부산 광안리 오션뷰", price: "326,000원", isSold: false },
  {
    id: 237,
    title: "양양 반려동물 동반 숙소",
    price: "326,000원",
    isSold: false,
  },
  { id: 236, title: "경주 한옥 스테이", price: "326,000원", isSold: false },
  { id: 235, title: "여수 바다 앞 숙박권", price: "326,000원", isSold: false },
  { id: 234, title: "전주 감성 한옥 숙소", price: "326,000원", isSold: false },
];

export default function ProductHistory({ activeTab }: ProductHistoryProps) {
  // 같은 컴포넌트를 두 페이지에서 사용하고, 전달받은 값으로 화면만 바꿔요.
  const isMine = activeTab === "mine";

  return (
    <section>
      <div className={styles.tabs}>
        <Link className={isMine ? styles.activeTab : ""} href="/mypage">
          나의 상품
        </Link>
        <Link
          className={!isMine ? styles.activeTab : ""}
          href="/mypage/bookmarks"
        >
          북마크
        </Link>
      </div>

      <label className={styles.searchBox}>
        <Image src="/icons/search.svg" alt="" width={18} height={18} />
        <input
          aria-label="상품 검색"
          placeholder="필요한 내용을 검색해 주세요."
        />
      </label>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.number}>번호</span>
          <span className={styles.productName}>상품명</span>
          <span className={styles.price}>판매가격</span>

          {/* 북마크 화면에서만 판매자 열이 보여요. */}
          {!isMine && <span className={styles.seller}>판매자</span>}

          <span className={styles.date}>날짜</span>

          {/* 나의 상품 화면에서는 삭제 아이콘이 들어갈 자리를 남겨요. */}
          {isMine && <span className={styles.deleteSpace} />}
        </div>

        {products.map((product) => (
          <div className={styles.tableRow} key={product.id}>
            <span className={styles.number}>{product.id}</span>
            {/* 상품명을 판매 완료 여부에 따라 클래스를 다르게 적용 */}
            <span className={styles.productName}>
              <span
                className={
                  isMine && product.isSold
                    ? styles.soldTitle
                    : styles.activeTitle
                }
              >
                {product.title}
              </span>

              {/* 파란 글자는 북마크 표시가 아니라 판매 상태예요. */}
              {isMine && product.isSold && (
                <em className={styles.sold}>판매 완료</em>
              )}
            </span>

            <span className={styles.price}>{product.price}</span>

            {!isMine && <span className={styles.seller}>홍길동</span>}

            <span className={styles.date}>2024.12.16</span>

            {isMine && (
              <button
                className={styles.deleteButton}
                type="button"
                aria-label={`${product.title} 삭제`}
              >
                <Image src="/icons/delete.svg" alt="" width={17} height={17} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
