import BoardSection from "@/components/home/board-section";
import HeroBanner from "@/components/home/hero-banner";

export default function HomePage() {
  return (
    <main>
      {/* 페이지는 큰 화면 조각을 순서대로 조립해요. */}
      <HeroBanner />
      <BoardSection />
    </main>
  );
}
