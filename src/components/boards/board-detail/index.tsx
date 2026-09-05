"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import BoardComments from "@/components/boards/board-comments";
import { DISLIKE_BOARD, LIKE_BOARD } from "@/graphql/mutations";
import { FETCH_BOARD } from "@/graphql/queries";
import type { Board } from "@/types/board";
import styles from "./styles.module.css";

// API의 contents 안에 HTML 태그가 들어와도 줄바꿈을 유지하며 글자만 추출하는 함수
const removeHtmlTags = (contents: string) =>
  contents
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "");

type BoardDetailProps = {
  boardId: string;
};

export default function BoardDetail({ boardId }: BoardDetailProps) {
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
      {/* 1. 게시글 제목 */}
      <h1>{board.title}</h1>

      {/* 2. 작성자 정보 & 우측 아이콘 */}
      <div className={styles.information}>
        <div className={styles.writerInfo}>
          <span className={styles.avatar}>
            <Image
              src="/icons/profile.svg"
              alt="프로필"
              width={24}
              height={24}
            />
          </span>
          <div>
            <strong>{board.writer ?? "익명"}</strong>
            <time>{board.createdAt.slice(0, 10).replaceAll("-", ".")}</time>
          </div>
        </div>

        <div className={styles.topIcons}>
          <Image src="/icons/link.svg" alt="링크 복사" width={20} height={20} />
          <Image src="/icons/location.svg" alt="위치" width={20} height={20} />
        </div>
      </div>

      {/* 3. 본문 상단 세로 이미지 (board-detail1.svg) */}
      <div className={styles.firstImageBox}>
        <img
          className={styles.firstImage}
          src="/images/board-detail1.svg"
          alt="게시글 상단 이미지"
        />
      </div>

      {/* 4. 본문 내용 (줄바꿈 유지) */}
      <p className={styles.contents}>{removeHtmlTags(board.contents)}</p>

      {/* 5. 본문 하단 동영상 썸네일 이미지 (board-detail2.svg) */}
      <div className={styles.secondImageBox}>
        <img
          className={styles.secondImage}
          src="/images/board-detail2.svg"
          alt="게시글 동영상 썸네일"
        />
      </div>

      {/* 6. 좋아요 / 싫어요 리액션 */}
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
            width={30}
            height={30}
          />
          <span>{board.dislikeCount ?? 0}</span>
        </button>

        <button className={styles.reaction} type="button" onClick={onClickLike}>
          <Image
            className={styles.likeIcon}
            src="/icons/good.svg"
            alt="좋아요"
            width={30}
            height={30}
          />
          <span>{board.likeCount ?? 0}</span>
        </button>
      </div>

      {/* 7. 목록으로 / 수정하기 버튼 */}
      <div className={styles.actions}>
        <Link href="/">
          <Image src="/icons/menu.svg" alt="" width={18} height={18} />
          목록으로
        </Link>
        <Link href={`/boards/${boardId}/edit`}>
          <Image src="/icons/edit.svg" alt="" width={18} height={18} />
          수정하기
        </Link>
      </div>

      {/* 8. 댓글 섹션 */}
      <BoardComments boardId={boardId} />
    </article>
  );
}
