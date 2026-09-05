"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import BoardWrite from "@/components/boards/board-write";
import { FETCH_BOARD } from "@/graphql/queries";
import type { Board } from "@/types/board";

export default function BoardEditPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;

  // 기존 게시글 데이터를 불러와서 BoardWrite에 전달해요.
  const { data, loading } = useQuery<{ fetchBoard: Board }>(FETCH_BOARD, {
    variables: { boardId },
    ssr: false,
  });

  if (loading)
    return (
      <p style={{ padding: 100, textAlign: "center" }}>
        게시글 정보를 불러오고 있어요...
      </p>
    );

  return <BoardWrite isEdit={true} data={data?.fetchBoard} boardId={boardId} />;
}
