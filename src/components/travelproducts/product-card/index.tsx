"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./styles.module.css";

// 상품 카드가 받아야 하는 값들의 타입이에요.
type ProductCardProps = {
  id: string;
  image: string;
  title: string;
  description: string;
  tag: string;
  writer: string;
  price: string;
};

export default function ProductCard({
  id,
  image,
  title,
  description,
  tag,
  writer,
  price,
}: ProductCardProps) {
  // 북마크 API는 다음 수업에서 연결하므로 화면 토글만 먼저 유지해요.
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageBox}>
        <Link href={`/travelproducts/${id}`}>
          <img className={styles.productImage} src={image} alt={title} />
        </Link>

        <button
          className={`${styles.bookmarkButton} ${isBookmarked ? styles.active : ""}`}
          type="button"
          onClick={handleBookmark}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
        >
          <Image src="/icons/bookmark.svg" alt="" width={22} height={22} />
          <span>24</span>
        </button>
      </div>

      <Link className={styles.textBox} href={`/travelproducts/${id}`}>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className={styles.tag}>{tag}</span>

        <div className={styles.bottomRow}>
          <div className={styles.writer}>
            <span className={styles.avatar}>
              <Image src="/icons/person.svg" alt="" width={18} height={18} />
            </span>
            <span>{writer}</span>
          </div>
          <strong>{price}</strong>
        </div>
      </Link>
    </article>
  );
}
