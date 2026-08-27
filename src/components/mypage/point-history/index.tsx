import Link from "next/link";
import styles from "./styles.module.css";

type PointHistoryProps = {
  activeTab: "all" | "charge" | "buy" | "sell";
};

type TotalPointItem = {
  id: number;
  date: string;
  type: "충전" | "구매" | "판매";
  amount: string;
  balance: string;
};

const tabLinks = [
  { name: "전체", value: "all", href: "/mypage/points" },
  { name: "충전내역", value: "charge", href: "/mypage/points/charge" },
  { name: "구매내역", value: "buy", href: "/mypage/points/buy" },
  { name: "판매내역", value: "sell", href: "/mypage/points/sell" },
];

// 전체 탭은 충전, 구매, 판매가 섞인 내역을 보여줘요.
const totalItems: TotalPointItem[] = [
  {
    id: 1,
    date: "2024.12.16",
    type: "충전",
    amount: "+1,000,000",
    balance: "1,222,000",
  },
  {
    id: 2,
    date: "2024.12.16",
    type: "구매",
    amount: "-50,000",
    balance: "1,222,000",
  },
  {
    id: 3,
    date: "2024.12.16",
    type: "판매",
    amount: "+1,000,000",
    balance: "1,222,000",
  },
  {
    id: 4,
    date: "2024.12.16",
    type: "충전",
    amount: "+1,000,000",
    balance: "1,222,000",
  },
  {
    id: 5,
    date: "2024.12.16",
    type: "충전",
    amount: "+1,000,000",
    balance: "1,222,000",
  },
  {
    id: 6,
    date: "2024.12.16",
    type: "구매",
    amount: "-50,000",
    balance: "1,222,000",
  },
  {
    id: 7,
    date: "2024.12.16",
    type: "구매",
    amount: "-50,000",
    balance: "1,222,000",
  },
  {
    id: 8,
    date: "2024.12.16",
    type: "판매",
    amount: "+1,000,000",
    balance: "1,222,000",
  },
  {
    id: 9,
    date: "2024.12.16",
    type: "판매",
    amount: "+1,000,000",
    balance: "1,222,000",
  },
  {
    id: 10,
    date: "2024.12.16",
    type: "구매",
    amount: "-50,000",
    balance: "1,222,000",
  },
];

// 같은 디자인의 행을 열 개 그리기 위한 간단한 번호 배열이에요.
const rowNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function PointHistory({ activeTab }: PointHistoryProps) {
  return (
    <section>
      <nav className={styles.tabs}>
        {tabLinks.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className={activeTab === tab.value ? styles.activeTab : ""}
          >
            {tab.name}
          </Link>
        ))}
      </nav>

      <div className={styles.table}>
        {/* 전체 내역: 날짜 / 내용 / 거래 및 충전 내역 */}
        {activeTab === "all" && (
          <>
            <div className={`${styles.tableHeader} ${styles.allColumns}`}>
              <span>날짜</span>
              <span>내용</span>
              <span>거래 및 충전 내역</span>
              <span>잔액</span>
            </div>

            {totalItems.map((item) => (
              <div
                className={`${styles.tableRow} ${styles.allColumns}`}
                key={item.id}
              >
                <span className={styles.date}>{item.date}</span>
                <span
                  className={item.type === "구매" ? styles.minus : styles.plus}
                >
                  {item.type}
                </span>
                <span
                  className={item.type === "구매" ? styles.minus : styles.plus}
                >
                  {item.amount}
                </span>
                <span>{item.balance}</span>
              </div>
            ))}
          </>
        )}

        {/* 충전 내역은 충전일, 결제 ID, 충전내역, 거래 후 잔액을 보여줘요. */}
        {activeTab === "charge" && (
          <>
            <div className={`${styles.tableHeader} ${styles.chargeColumns}`}>
              <span>충전일</span>
              <span>결제 ID</span>
              <span>충전내역</span>
              <span>거래 후 잔액</span>
            </div>

            {rowNumbers.map((number) => (
              <div
                className={`${styles.tableRow} ${styles.chargeColumns}`}
                key={number}
              >
                <span className={styles.date}>2024.12.16</span>
                <span>abcd1243</span>
                <span className={styles.plus}>+1,000,000</span>
                <span>1,222,000</span>
              </div>
            ))}
          </>
        )}

        {/* 구매 내역은 거래일, 상품 명, 거래내역, 거래 후 잔액, 판매자를 보여줘요. */}
        {activeTab === "buy" && (
          <>
            <div className={`${styles.tableHeader} ${styles.buyColumns}`}>
              <span>거래일</span>
              <span>상품명</span>
              <span>거래내역</span>
              <span>거래 후 잔액</span>
              <span>판매자</span>
            </div>

            {rowNumbers.map((number) => (
              <div
                className={`${styles.tableRow} ${styles.buyColumns}`}
                key={number}
              >
                <span className={styles.date}>2024.12.16</span>
                <span>파라다이스 호텔 제주</span>
                <span className={styles.minus}>-1,000,000</span>
                <span>1,222,000</span>
                <span>홍길동</span>
              </div>
            ))}
          </>
        )}

        {/* 판매 내역은 거래일, 상품 명, 거래내역, 거래 후 잔액을 보여줘요. */}
        {activeTab === "sell" && (
          <>
            <div className={`${styles.tableHeader} ${styles.sellColumns}`}>
              <span>거래일</span>
              <span>상품명</span>
              <span>거래내역</span>
              <span>거래 후 잔액</span>
            </div>
            {rowNumbers.map((number) => (
              <div
                className={`${styles.tableRow} ${styles.sellColumns}`}
                key={number}
              >
                <span className={styles.date}>2024.12.16</span>
                <span>파르나스 호텔 제주</span>
                <span className={styles.plus}>+1,000,000</span>
                <span>1,222,000</span>
              </div>
            ))}
          </>
        )}

        <div className={styles.pagination}>
          <button type="button">‹</button>
          <button className={styles.currentPage} type="button">
            1
          </button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">4</button>
          <button type="button">5</button>
          <button type="button">›</button>
        </div>
      </div>
    </section>
  );
}
