"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { FETCH_BOARDS } from "@/graphql/queries";
import type { Board } from "@/types/board";
import styles from "./styles.module.css";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=640&q=80",
];

const formatDate = (date: string) => date.slice(0, 10).replaceAll("-", ".");

export default function BoardSection() {
  const [keyword, setKeyword] = useState("");
  const { data, loading, error, refetch } = useQuery<{ fetchBoards: Board[] }>(
    FETCH_BOARDS,
    {
      variables: { page: 1, search: "" },
      // 이 Query는 브라우저 화면이 열린 뒤 실행해요.
      ssr: false,
    },
  );

  const boards = data?.fetchBoards ?? [];
  // 같은 게시글 목록에서 앞의 4개만 골라 위쪽 카드에 사용해요.
  const hotBoards = boards.slice(0, 4);
  const displayedBoards = boards.slice(0, 10);

  const onSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refetch({ page: 1, search: keyword });
  };

  if (loading)
    return <p className={styles.state}>게시글을 불러오고 있어요...</p>;
  if (error) return <p className={styles.state}>API 연결을 확인해주세요.</p>;

  return (
    <section className={styles.section}>
      <div className={styles.hotSection}>
        <h2>오늘 핫한 트립토크</h2>

        <div className={styles.cardList}>
          {hotBoards.map((board, index) => (
            <Link
              className={styles.card}
              href={`/boards/${board._id}`}
              key={board._id}
            >
              <img
                className={styles.cardImage}
                src={CARD_IMAGES[index]}
                alt="여행지"
              />

              <div className={styles.cardContent}>
                <h3>{board.title}</h3>

                <p className={styles.writer}>
                  <span className={styles.avatar}>👤</span>
                  {board.writer ?? "익명"}
                </p>

                <div className={styles.cardBottom}>
                  <span>♡ {board.likeCount}</span>
                  <time>{formatDate(board.createdAt)}</time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.boardArea}>
        <h2>트립토크 게시판</h2>

        <div className={styles.tools}>
          <form className={styles.search} onSubmit={onSubmitSearch}>
            {/* 날짜 검색은 모양만 먼저 만들어요. */}
            <div className={styles.dateBox}>
              ▣&nbsp;&nbsp; YYYY. MM. DD - YYYY. MM. DD
            </div>

            <label className={styles.searchBox}>
              <span>⌕</span>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="제목을 검색해 주세요."
              />
            </label>

            <button className={styles.searchButton} type="submit">
              검색
            </button>
          </form>

          {/* 등록 화면의 기능은 없지만, 빈 페이지로 이동하는 것부터 연습해요. */}
          <Link className={styles.writeButton} href="/boards/new">
            ▣&nbsp; 트립토크 등록
          </Link>
        </div>

        <div className={styles.tableBox}>
          <div className={`${styles.row} ${styles.head}`}>
            <span className={styles.number}>번호</span>
            <span className={styles.titleCell}>제목</span>
            <span className={styles.writerCell}>작성자</span>
            <span className={styles.dateCell}>날짜</span>
          </div>

          {displayedBoards.map((board, index) => (
            <div className={styles.row} key={board._id}>
              <span className={styles.number}>{243 - index}</span>
              <Link className={styles.titleCell} href={`/boards/${board._id}`}>
                {board.title}
              </Link>
              <span className={styles.writerCell}>
                {board.writer ?? "익명"}
              </span>
              <time className={styles.dateCell}>
                {formatDate(board.createdAt)}
              </time>
            </div>
          ))}

          <div className={styles.pagination}>
            <button type="button">‹</button>
            <button className={styles.selected} type="button">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">4</button>
            <button type="button">5</button>
            <button type="button">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
