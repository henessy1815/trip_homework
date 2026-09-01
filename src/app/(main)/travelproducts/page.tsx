"use client";

import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

import HeroBanner from "@/components/home/hero-banner";
import ProductCard from "@/components/travelproducts/product-card";
import { FETCH_TRAVELPRODUCTS } from "@/graphql/queries";
import type { Travelproduct } from "@/types/travelproduct";

import styles from "./styles.module.css";

// 검색창 아래에 보여 줄 숙소 테마와 아이콘이에요.
const categories = [
  { name: "1인 전용", icon: "/icons/single_person_accommodation.svg" },
  { name: "아파트", icon: "/icons/apartment.svg" },
  { name: "호텔", icon: "/icons/hotel.svg" },
  { name: "캠핑", icon: "/icons/camp.svg" },
  { name: "룸 서비스 가능", icon: "/icons/room_service.svg" },
  { name: "불멍", icon: "/icons/fire.svg" },
  { name: "반신욕&스파", icon: "/icons/spa.svg" },
  { name: "바다 위 숙소", icon: "/icons/house_on_the_sea.svg" },
  { name: "플랜테리어", icon: "/icons/planterior.svg" },
];

const getImageUrl = (images?: string[]) => {
  const image = images?.find((item) => item !== "");
  if (!image) return "/images/a.png";
  if (image.startsWith("http")) return image;
  return `https://storage.googleapis.com/${image}`;
};

export default function TravelProductsPage() {
  const [keyword, setKeyword] = useState("");
  const { data, loading, error, refetch } = useQuery<{
    fetchTravelproducts: Travelproduct[];
  }>(FETCH_TRAVELPRODUCTS, {
    variables: { page: 1, search: "" },
    ssr: false,
  });

  const products = data?.fetchTravelproducts ?? [];
  // 목록 API 결과 중 앞의 두 상품을 큰 추천 카드에도 재사용해요.
  const featuredProducts = products.slice(0, 2);

  const onSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refetch({ page: 1, search: keyword });
  };

  return (
    <main>
      {/* 메인 페이지와 같은 배너를 재사용하되, 이 페이지에서는 글자를 숨겨요. */}
      <HeroBanner showText={false} />

      <div className={styles.page}>
        <section className={styles.featureSection}>
          <h1 className={styles.mainTitle}>
            2026 끝여름 낭만있게 마무리 하고 싶다면?
          </h1>

          <div className={styles.featureList}>
            {featuredProducts.map((product) => (
              <Link
                className={styles.featureCard}
                href={`/travelproducts/${product._id}`}
                key={product._id}
              >
                <Image
                  className={styles.featureImage}
                  src={getImageUrl(product.images)}
                  alt={product.name}
                  width={628}
                  height={628}
                  unoptimized
                />

                <div className={styles.featureBookmark}>
                  <Image
                    src="/icons/bookmark.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span>{product.pickedCount}</span>
                </div>

                <div className={styles.featureText}>
                  <strong>{product.name}</strong>
                  <p>{product.remarks}</p>
                  <b>{product.price.toLocaleString()} 원</b>
                </div>
              </Link>
            ))}

            {loading && <p>추천 숙박권을 불러오고 있어요...</p>}

            <button
              className={styles.nextButton}
              type="button"
              aria-label="다음 숙소 보기"
            >
              ›
            </button>
          </div>
        </section>

        <Image
          className={styles.adBanner}
          src="/images/banner.png"
          alt="빌 패소 르꼬 전시회 근처 숙소 특가 예약"
          width={1280}
          height={240}
        />

        <section className={styles.productSection}>
          <h2>여기에서만 예약할 수 있는 숙소</h2>

          <div className={styles.tabs}>
            <button className={styles.activeTab} type="button">
              예약 가능 숙소
            </button>
            <button type="button">예약 마감 숙소</button>
          </div>

          <form className={styles.toolbar} onSubmit={onSubmitSearch}>
            <div className={styles.dateBox}>
              <Image src="/icons/calendar.svg" alt="" width={24} height={24} />
              <span>YYYY. MM. DD - YYYY. MM. DD</span>
            </div>

            <label className={styles.searchBox}>
              <Image src="/icons/search.svg" alt="" width={24} height={24} />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="제목을 검색해 주세요."
              />
            </label>

            <button className={styles.searchButton} type="submit">
              검색
            </button>

            <Link className={styles.sellButton} href="/travelproducts/new">
              <Image src="/icons/rwite.svg" alt="" width={20} height={20} />
              숙박권 판매하기
            </Link>
          </form>

          <div className={styles.categoryList}>
            {categories.map((category) => (
              <button
                className={styles.category}
                type="button"
                key={category.name}
              >
                <Image src={category.icon} alt="" width={40} height={40} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className={styles.productList} id="product-list">
            {loading && <p>숙박권을 불러오고 있어요...</p>}
            {error && <p>숙박권 API 연결을 확인해 주세요.</p>}
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={getImageUrl(product.images)}
                title={product.name}
                description={product.remarks}
                tag={product.tags?.join(" ") ?? ""}
                writer={product.seller?.name ?? "판매자"}
                price={`${product.price.toLocaleString()} 원`}
              />
            ))}
          </div>
        </section>
      </div>

      {/* 오른쪽 하단의 '최근 본 상품'. */}
      <aside className={styles.recentProducts}>
        <strong>최근 본 상품</strong>
        <Image src="/images/b.png" alt="최근 본 숙소" width={70} height={70} />
        <Image src="/images/c.png" alt="최근 본 숙소" width={70} height={70} />
        <Image src="/images/d.png" alt="최근 본 숙소" width={70} height={70} />
      </aside>
    </main>
  );
}
