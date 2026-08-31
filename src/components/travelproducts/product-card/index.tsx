"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./styles.module.css";

// 상품 카드가 받아야하는 값들의 타입
type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  tag: string;
  writer: string;
  price: string;
};

export default function ProductCard({
  image,
  title,
  description,
  tag,
  writer,
  price,
}: ProductCardProps) {
  //아직 api는 연결하지 않았으므로 누른 카드의 북마크만 임시로 바꿈
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageBox}>
        <Image
          className={styles.productImage}
          src={image}
          alt={title}
          width={296}
          height={296}
        />
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

      <div className={styles.textBox}>
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
      </div>
    </article>
  );
}
