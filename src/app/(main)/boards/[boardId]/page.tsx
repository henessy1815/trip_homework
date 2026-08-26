import BoardDetail from "@/components/boards/board-detail";
import HeroBanner from "@/components/home/hero-banner";

type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailPage({
  params,
}: BoardDetailPageProps) {
  // [boardId]처럼 대괄호 폴더로 만든 주소는 params로 값을 받아요.
  const { boardId } = await params;

  return (
    <main>
      {/* 상세 페이지에서는 메인보다 낮은 배너를 재사용해요. */}
      <HeroBanner small />
      <BoardDetail boardId={boardId} />
    </main>
  );
}
