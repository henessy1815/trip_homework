"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

type ProductDetailProps = {
  productId: string;
};

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [comment, setComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isCommentValid = comment.trim().length > 0;

  return (
    <div className={styles.container}>
      {/* 1. 상단 타이틀 & 헤더 */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>포항 : 숙박권 명이 여기에 들어갑니다</h1>
          <p className={styles.subtitle}>모던한 분위기의 감도높은 숙소</p>
          <div className={styles.tags}>
            <span>#6인 이하</span>
            <span>#건식 사우나</span>
            <span>#애견동반 가능</span>
          </div>
        </div>
        {/* 우측 아이콘 그룹 */}
        <div className={styles.iconGroup}>
          <button type="button" className={styles.iconBtn} title="삭제">
            <Image src="/icons/delete.svg" alt="삭제" width={20} height={20} />
          </button>
          <button type="button" className={styles.iconBtn} title="링크 복사">
            <Image src="/icons/link.svg" alt="링크" width={20} height={20} />
          </button>
          <button type="button" className={styles.iconBtn} title="위치">
            <Image
              src="/icons/location.svg"
              alt="위치"
              width={20}
              height={20}
            />
          </button>
          <button
            type="button"
            className={`${styles.bookmarkBadge} ${isBookmarked ? styles.activeBookmark : ""}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Image
              src="/icons/bookmark.svg"
              alt="북마크"
              width={16}
              height={16}
            />
            <span>24</span>
          </button>
        </div>
      </div>
      {/* 2. 메인 사진 갤러리 & 우측 구매 사이드바 */}
      <div className={styles.mainSection}>
        {/* 이미지 갤러리 (좌측 큰 이미지 + 우측 썸네일 3개) */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <img src="/images/a.png" alt="메인 숙소 사진" />
          </div>
          <div className={styles.thumbList}>
            <img src="/images/b.png" alt="썸네일 1" />
            <img src="/images/c.png" alt="썸네일 2" />
            <img src="/images/d.png" alt="썸네일 3" />
          </div>
        </div>
        {/* 우측 사이드바 (가격 및 구매 / 판매자 정보) */}
        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <strong className={styles.price}>32,500원</strong>
            <ul className={styles.noticeList}>
              <li>
                숙박권은 트립트립에서 포인트 충전 후 구매하실 수 있습니다.
              </li>
              <li>상세 설명에 숙박권 사용기한을 꼭 확인해 주세요.</li>
            </ul>
            <button type="button" className={styles.buyButton}>
              구매하기
            </button>
          </div>
          <div className={styles.sellerCard}>
            <span className={styles.sellerLabel}>판매자</span>
            <div className={styles.sellerProfile}>
              <div className={styles.sellerAvatar}>
                <img src="/images/b.png" alt="판매자 프로필" />
              </div>
              <span className={styles.sellerName}>김남일</span>
            </div>
          </div>
        </aside>
      </div>
      <hr className={styles.divider} />
      {/* 3. 상세 설명 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>상세 설명</h2>
        <div className={styles.description}>
          <p>
            살어리 살어리랏다 청산(靑山)애 살어리랏다 멀위랑 ᄃᆞ래랑 먹고
            청산(靑山)애 살어리랏다 얄리얄리 얄랑셩 얄라리 얄라 우러라 우러라
            새여 자고 니러 우러라 새여 널라와 시름 한 나도 자고 니러 우니로라
            리얄리 얄라셩 얄라리 얄라 가던 새 가던 새 본다 물 아래 가던 새 본다
            잉무든 장글란 가지고 물 아래 가던 새 본다 얄리얄리 얄라셩 얄라리
            얄라
          </p>
          <p>
            이링공 뎌링공 후야 나즈란 디내와손뎌
            <br />
            오리도 가리도 업슨 바므란 또 엇디 호리라
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            어디라 더디던 돌코 누리라 마치던 돌코
            <br />
            믜리도 괴리도 업시 마자셔 우니노라
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            살어리 살어리랏다 바루래 살어리랏다
            <br />
            ᄂᆞᄆᆞ자기 구조개랑 먹고 바루래 살어리랏다
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            가다가 가다가 드로라 에정지 가다가 드로라
            <br />
            사ᄉᆞ미 즛대예 올라셔 奚琴(해금)을 혀거를 드로라
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            가다니 븨브른 도긔 설진 강수를 비조라
            <br />
            조롱곳 누로기 ᄆᆡ와 잡ᄉᆞ와니 내 엇디 ᄒᆞ리잇고
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
        </div>
      </section>
      <hr className={styles.divider} />
      {/* 4. 상세 위치 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>상세 위치</h2>
        <div className={styles.mapBox}>
          {/* 지도 이미지 또는 지도 컴포넌트 */}
          <div className={styles.mapPlaceholder}>
            <span>📍 서울특별시 강동구 강일동</span>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* 5. 문의하기 */}
      <section className={styles.section}>
        <div className={styles.commentHeader}>
          <span>💬 문의하기</span>
        </div>
        <div className={styles.commentBox}>
          <textarea
            className={styles.commentTextarea}
            placeholder="문의사항을 입력해 주세요."
            maxLength={100}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className={styles.commentBottom}>
            <span className={styles.charCount}>{comment.length}/100</span>
          </div>
        </div>
        <div className={styles.commentButtonWrapper}>
          <button
            type="button"
            disabled={!isCommentValid}
            className={`${styles.commentSubmitButton} ${isCommentValid ? styles.active : ""}`}
          >
            문의 하기
          </button>
        </div>
      </section>
    </div>
  );
}
