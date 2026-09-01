"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import BoardComments from "@/components/boards/board-comments";
import { DISLIKE_BOARD, LIKE_BOARD } from "@/graphql/mutations";
import { FETCH_BOARD } from "@/graphql/queries";
import type { Board } from "@/types/board";
import styles from "./styles.module.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85";

// API의 contents 안에 HTML 태그가 들어와도 글자만 보여주기 위한 함수예요.
const removeHtmlTags = (contents: string) => contents.replace(/<[^>]*>/g, "");

// 게시글에 이미지가 없으면 준비해 둔 여행 사진을 대신 보여줘요.
const getImageUrl = (images?: string[] | null) => {
  const firstImage = images?.find((image) => image !== "");

  if (!firstImage) return FALLBACK_IMAGE;
  if (firstImage.startsWith("http")) return firstImage;

  return `https://storage.googleapis.com/${firstImage}`;
};

type BoardDetailProps = {
  boardId: string;
};

export default function BoardDetail({ boardId }: BoardDetailProps) {
  // 목록에서 받은 boardId를 변수로 보내 게시글 하나만 조회해요.
  const { data, loading, error, refetch } = useQuery<{ fetchBoard: Board }>(
    FETCH_BOARD,
    {
      variables: { boardId },
      ssr: false,
    },
  );

  const [likeBoard] = useMutation(LIKE_BOARD);
  const [dislikeBoard] = useMutation(DISLIKE_BOARD);

  const onClickLike = async () => {
    await likeBoard({ variables: { boardId } });
    await refetch();
  };

  const onClickDislike = async () => {
    await dislikeBoard({ variables: { boardId } });
    await refetch();
  };

  if (loading)
    return <p className={styles.state}>게시글을 불러오고 있어요...</p>;
  if (error || !data)
    return <p className={styles.state}>게시글을 불러오지 못했어요.</p>;

  const board = data.fetchBoard;

  return (
    <article className={styles.article}>
      <h1>{board.title}</h1>

      <div className={styles.information}>
        <div className={styles.avatar}>👤</div>
        <div>
          <strong>{board.writer ?? "익명"}</strong>
          <time>{board.createdAt.slice(0, 10).replaceAll("-", ".")}</time>
        </div>
      </div>

      <img
        className={styles.mainImage}
        src={getImageUrl(board.images)}
        alt="게시글 여행지"
      />
      <p className={styles.contents}>{removeHtmlTags(board.contents)}</p>

      <div className={styles.reactionArea}>
        <button
          className={styles.reaction}
          type="button"
          onClick={onClickDislike}
        >
          <Image
            className={styles.dislikeIcon}
            src="/icons/bad.svg"
            alt="싫어요"
            width={36}
            height={36}
          />
          <span>{board.dislikeCount ?? 0}</span>
        </button>

        <button className={styles.reaction} type="button" onClick={onClickLike}>
          <Image
            className={styles.likeIcon}
            src="/icons/good.svg"
            alt="좋아요"
            width={36}
            height={36}
          />
          <span>{board.likeCount}</span>
        </button>
      </div>

      <div className={styles.actions}>
        <Link href="/">
          <Image src="/icons/menu.svg" alt="" width={20} height={20} />
          목록으로
        </Link>
        {/* 수정 페이지 API 연결 전이라 버튼 모양만 먼저 만들어요. */}
        <button type="button">
          <Image src="/icons/edit.svg" alt="" width={20} height={20} />
          수정하기
        </button>
      </div>
      <BoardComments boardId={boardId} />
    </article>
  );
}
