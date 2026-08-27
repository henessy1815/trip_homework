"use client";

import { useState } from "react";
import styles from "./styles.module.css";

// 화면 확인용 더미 데이터
const DUMMY_PRODUCTS = [
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: true,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: true,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: true,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
  {
    id: "343",
    name: "파르나스 호텔 제주",
    isSoldOut: false,
    price: 326000,
    date: "2024.12.18",
  },
];

export default function MyProducts() {
  const [currentTab, setCurrentTab] = useState<"myProducts" | "bookmarks">(
    "myProducts",
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색어:", searchKeyword);
    // 추후 검색 API 연동
  };

  return (
    <div className={styles.container}>
      {/* 1. 상단 탭 & 검색바 영역 */}
      <div className={styles.topBar}>
        {/* 좌측: [나의 상품] / [북마크] 탭 */}
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tabButton} ${currentTab === "myProducts" ? styles.activeTab : ""}`}
            onClick={() => setCurrentTab("myProducts")}
          >
            나의 상품
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${currentTab === "bookmarks" ? styles.activeTab : ""}`}
            onClick={() => setCurrentTab("bookmarks")}
          >
            북마크
          </button>
        </div>

        {/* 우측: 검색창 + 검색 버튼 */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="필요한 내용을 입력해 주세요."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
      </div>

      {/* 2. 상품 목록 테이블 카드 */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colNumber}>번호</th>
              <th className={styles.colName}>상품명</th>
              <th className={styles.colPrice}>판매가격</th>
              <th className={styles.colDate}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_PRODUCTS.map((item, index) => (
              <tr key={index}>
                <td className={styles.colNumber}>{item.id}</td>
                <td className={styles.colName}>
                  <span
                    className={
                      item.isSoldOut ? styles.soldOutTitle : styles.productTitle
                    }
                  >
                    {item.name}
                  </span>
                  {item.isSoldOut && (
                    <span className={styles.soldBadge}>판매 완료</span>
                  )}
                </td>
                <td className={styles.colPrice}>
                  {item.price.toLocaleString()}원
                </td>
                <td className={styles.colDate}>
                  <span>{item.date}</span>
                  {index === 0 && (
                    <span className={styles.trashIcon} title="삭제">
                      🗑️
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
