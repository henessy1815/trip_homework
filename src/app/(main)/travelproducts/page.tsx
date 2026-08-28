import Image from "next/image";
import Link from "next/link";

import HeroBanner from "@/components/home/hero-banner";
import ProductCard from "@/components/travelproducts/product-card";

import styles from "./styles.module.css";

// 상단의 큰 추천 숙소 카드에 보여 줄 내용
const featuredProducts = [
  {
    id: 1,
    image: "/images/a.png",
    title: "포항 : 당장 가고 싶은 숙소",
    description: "살어리 살어리랐다 청산(靑山)에 쉬어가요.",
  },
  {
    id: 2,
    image: "/images/b.png",
    title: "강릉 : 마음까지 깨끗해지는 하얀 숙소",
    description: "시원한 바다와 하늘을 한눈에 담아보세요.",
  },
];

// 검색창 아래에 보여 줄 숙소 테마와 아이콘
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

// 현재는 api를 연결하지 않고, 화면 연습을 위한 임시 상품 보여주기
const products = [
  { id: 1, image: "/images/a.png", writer: "반얀트리" },
  { id: 2, image: "/images/c.png", writer: "트립러버" },
  { id: 3, image: "/images/d.png", writer: "반얀트리" },
  { id: 4, image: "/images/b.png", writer: "바다좋아" },
  { id: 5, image: "/images/c.png", writer: "여행일기" },
  { id: 6, image: "/images/d.png", writer: "쉬어가요" },
  { id: 7, image: "/images/b.png", writer: "트립러버" },
  { id: 8, image: "/images/a.png", writer: "반얀트리" },
];

export default function TravelProductsPage() {
  return (
    <main>
      {/* 메인 페이지와 같은 배너를 재사용하되, 이 페이지에선 글자 숨김 */}
      <HeroBanner showText={false} />

      <div className={styles.page}>
        <section className={styles.featureSection}>
          <h1 className={styles.mainTitle}>
            2026 끝여름 낭만있게 마무리 하고 싶다면?
          </h1>

          <div className={styles.featureList}>
            {featuredProducts.map((product) => (
              <article className={styles.featureCard} key={product.id}>
                <Image
                  className={styles.featureImage}
                  src={product.image}
                  alt={product.title}
                  width={628}
                  height={628}
                />

                <div className={styles.featureBookmark}>
                  <Image
                    src="/icons/bookmark.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span>24</span>
                </div>

                <div className={styles.featureText}>
                  <strong>{product.title}</strong>
                  <p>{product.description}</p>
                  <b>32,900 원</b>
                </div>
              </article>
            ))}

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

          <div className={styles.toolbar}>
            <div className={styles.dateBox}>
              <Image src="/icons/calendar.svg" alt="" width={24} height={24} />
              <span>YYYY. MM. DD - YYYY. MM. DD</span>
            </div>

            <label className={styles.searchBox}>
              <Image src="/icons/search.svg" alt="" width={24} height={24} />
              <input type="text" placeholder="제목을 검색해 주세요." />
            </label>

            <button className={styles.searchButton} type="button">
              검색
            </button>

            <Link href="/travelproducts/new" className={styles.sellButton}>
              <Image src="/icons/rwite.svg" alt="" width={20} height={20} />
              숙박권 판매하기
            </Link>
          </div>

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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title="강동 캠퍼스에서 쉬어가세요"
                description="편안한 클라스룸에서 코딩의 피로를 풀어 보세요."
                tag="#7인 이하 #코딩 #캠퍼스 #리프레시 가능"
                writer={product.writer}
                price="33,000 원"
              />
            ))}
          </div>
        </section>
      </div>

      {/* 오른쪽 하단의 '최근 본 상품' */}
      <aside className={styles.recentProducts}>
        <strong>최근 본 상품</strong>
        <Image src="/images/b.png" alt="최근 본 숙소" width={70} height={70} />
        <Image src="/images/c.png" alt="최근 본 숙소" width={70} height={70} />
        <Image src="/images/d.png" alt="최근 본 숙소" width={70} height={70} />
      </aside>
    </main>
  );
}
