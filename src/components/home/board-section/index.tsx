"use client";

import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { FETCH_BOARDS_OF_THE_BEST } from "@/graphql/queries";
import { FetchBoardsWithSearchDocument } from "@/gql/graphql";
import type { Board } from "@/types/board";
import styles from "./styles.module.css";

const CARD_IMAGES = [
  "https://plus.unsplash.com/premium_photo-1677343210638-5d3ce6ddbf85?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1719843013722-c2f4d69db940?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1787604590107-d07d5c7cfe20?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1785295210877-04e2c0d9bd52?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const formatDate = (date: string) => date.slice(0, 10).replaceAll("-", ".");

export default function BoardSection() {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 현재 선택된 페이지
  const [startPage, setStartPage] = useState(1); // 페이지 번호 묶음 시작(1, 11, 21...)
  const { data, loading, error, refetch } = useQuery(
    FetchBoardsWithSearchDocument,
    {
      variables: { page: 1, search: "" },
      // 이 Query는 브라우저 화면이 열린 뒤 실행해요.
      ssr: false,
    },
  );

  const { data: bestData } = useQuery<{ fetchBoardsOfTheBest: Board[] }>(
    FETCH_BOARDS_OF_THE_BEST,
    { ssr: false },
  );

  const boards = data?.fetchBoards ?? [];
  const hotBoards = bestData?.fetchBoardsOfTheBest.slice(0, 4) ?? [];
  const totalCount = data?.fetchBoardsCount ?? 0;

  // 전체 페이지 수 계산(한 페이지 당 10개씩)
  const lastPage = Math.ceil(totalCount / 10) || 1;

  // 특정 페이지 번호 클릭
  const onClickPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    refetch({ page: pageNumber, search: keyword });
  };

  // 이전 10페이지 묶음 이동 (<)
  const onClickPrevPage = () => {
    if (startPage === 1) return;
    const prevStart = startPage - 10;
    setStartPage(prevStart);
    setCurrentPage(prevStart);
    refetch({ page: prevStart, search: keyword });
  };

  // 다음 10페이지 묶음 이동 (>)
  const onClickNextPage = () => {
    if (startPage + 10 > lastPage) return;
    const nextStart = startPage + 10;
    setStartPage(nextStart);
    setCurrentPage(nextStart);
    refetch({ page: nextStart, search: keyword });
  };

  // 검색 실행 시 1페이지로 리셋
  const onSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    setStartPage(1);
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
                src={
                  board.images?.[0]
                    ? board.images[0].startsWith("http")
                      ? board.images[0]
                      : `http://storage.googleapis.com/${board.images[0]}`
                    : CARD_IMAGES[index]
                }
                alt="여행지"
              />

              <div className={styles.cardContent}>
                <h3>{board.title}</h3>

                <p className={styles.writer}>
                  <span className={styles.avatar}>
                    <Image
                      src="/icons/person.svg"
                      alt=""
                      width={18}
                      height={18}
                    />
                  </span>
                  {board.writer ?? "익명"}
                </p>

                <div className={styles.cardBottom}>
                  <span className={styles.likeCount}>
                    <Image
                      src="/icons/good.svg"
                      alt=""
                      width={18}
                      height={18}
                    />
                    {board.likeCount}
                  </span>
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
              <Image src="/icons/calendar.svg" alt="" width={20} height={20} />
              YYYY. MM. DD - YYYY. MM. DD
            </div>

            <label className={styles.searchBox}>
              <Image
                className={styles.searchIcon}
                src="/icons/search.svg"
                alt=""
                width={20}
                height={20}
              />
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

          {/* 등록 화면 */}
          <Link className={styles.writeButton} href="/boards/new">
            <Image
              className={styles.writeIcon}
              src="/icons/rwite.svg"
              alt=""
              width={20}
              height={20}
            />
            트립토크 등록
          </Link>
        </div>

        <div className={styles.tableBox}>
          <div className={`${styles.row} ${styles.head}`}>
            <span className={styles.number}>번호</span>
            <span className={styles.titleCell}>제목</span>
            <span className={styles.writerCell}>작성자</span>
            <span className={styles.dateCell}>날짜</span>
            <span className={styles.deleteSpace} />
          </div>

          {boards.map((board, index) => (
            <div className={styles.row} key={board._id}>
              {/* 전체 개수 기준 내림차순 번호 부여 */}
              <span className={styles.number}>
                {totalCount - ((currentPage - 1) * 10 + index)}
              </span>
              <Link className={styles.titleCell} href={`/boards/${board._id}`}>
                {board.title}
              </Link>
              <span className={styles.writerCell}>
                {board.writer ?? "익명"}
              </span>
              <time className={styles.dateCell}>
                {formatDate(board.createdAt)}
              </time>

              {/* 마우스를 올려야만 삭제 아이콘이 보여요. */}
              <button
                className={styles.deleteButton}
                type="button"
                aria-label={`${board.title} 삭제`}
              >
                <Image src="/icons/delete.svg" alt="" width={17} height={17} />
              </button>
            </div>
          ))}

          <div className={styles.pagination}>
            {/* 이전 묶음 버튼 */}
            <button
              type="button"
              onClick={onClickPrevPage}
              disabled={startPage === 1}
              style={{ cursor: startPage === 1 ? "default" : "pointer" }}
            >
              ‹
            </button>
            {/* 10개 단위 페이지 번호 버튼 */}
            {Array.from({ length: 10 }).map((_, index) => {
              const pageNum = startPage + index;
              if (pageNum > lastPage) return null;
              // 마지막 페이지를 넘어가면 숨김

              return (
                <button
                  key={pageNum}
                  type="button"
                  className={currentPage === pageNum ? styles.selected : ""}
                  onClick={() => onClickPage(pageNum)}
                  style={{ cursor: "pointer" }}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* 다음 묶음 버튼 */}
            <button
              type="button"
              onClick={onClickNextPage}
              disabled={startPage + 10 > lastPage}
              style={{
                cursor: startPage + 10 > lastPage ? "default" : "pointer",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
