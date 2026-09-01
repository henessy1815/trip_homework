"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  CREATE_BOARD_COMMENT,
  DELETE_BOARD_COMMENT,
  UPDATE_BOARD_COMMENT,
} from "@/graphql/mutations";
import { FETCH_BOARD_COMMENTS } from "@/graphql/queries";
import styles from "./styles.module.css";

type BoardComment = {
  _id: string;
  writer: string;
  contents: string;
  rating: number;
  createdAt: string;
};

type CommentsData = {
  fetchBoardComments: BoardComment[];
};

type BoardCommentsProps = {
  boardId: string;
};

export default function BoardComments({ boardId }: BoardCommentsProps) {
  const [writer, setWriter] = useState("");
  const [password, setPassword] = useState("");
  const [contents, setContents] = useState("");
  const [rating, setRating] = useState(0);
  const [editingId, setEditingId] = useState("");
  const [editingContents, setEditingContents] = useState("");

  const { data, loading, refetch } = useQuery<CommentsData>(
    FETCH_BOARD_COMMENTS,
    {
      variables: { boardId, page: 1 },
      ssr: false,
    },
  );

  const [createComment, { loading: creating }] =
    useMutation(CREATE_BOARD_COMMENT);
  const [deleteComment] = useMutation(DELETE_BOARD_COMMENT);
  const [updateComment] = useMutation(UPDATE_BOARD_COMMENT);

  const onSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!writer || !password || !contents || rating === 0) {
      alert("작성자, 비밀번호, 별점, 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      await createComment({
        variables: {
          boardId,
          input: { writer, password, contents, rating },
        },
      });

      // 등록이 끝나면 입력창을 비우고 댓글 목록을 다시 받아요.
      setWriter("");
      setPassword("");
      setContents("");
      setRating(0);
      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 등록에 실패했어요.");
    }
  };

  const onClickDelete = async (commentId: string) => {
    const commentPassword = prompt("댓글 비밀번호를 입력해 주세요.");
    if (!commentPassword) return;

    try {
      await deleteComment({
        variables: { boardCommentId: commentId, password: commentPassword },
      });
      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 삭제에 실패했어요.");
    }
  };

  const onClickEdit = (comment: BoardComment) => {
    setEditingId(comment._id);
    setEditingContents(comment.contents);
  };

  const onClickUpdate = async (comment: BoardComment) => {
    const commentPassword = prompt("댓글 비밀번호를 입력해 주세요.");
    if (!commentPassword || !editingContents.trim()) return;

    try {
      await updateComment({
        variables: {
          boardCommentId: comment._id,
          password: commentPassword,
          input: { contents: editingContents, rating: comment.rating },
        },
      });
      setEditingId("");
      setEditingContents("");
      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "댓글 수정에 실패했어요.");
    }
  };

  return (
    <section className={styles.section}>
      <h2>
        <Image src="/icons/chat.svg" alt="" width={20} height={20} />
        댓글
      </h2>

      <form className={styles.form} onSubmit={onSubmitComment}>
        <div className={styles.formTop}>
          <label>
            작성자 <span>*</span>
            <input
              value={writer}
              onChange={(event) => setWriter(event.target.value)}
              placeholder="작성자를 입력해 주세요."
            />
          </label>

          <label>
            비밀번호 <span>*</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요."
            />
          </label>

          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                className={score <= rating ? styles.selectedStar : ""}
                type="button"
                key={score}
                onClick={() => setRating(score)}
                aria-label={`${score}점`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={contents}
          onChange={(event) => setContents(event.target.value)}
          placeholder="댓글을 입력해 주세요."
          maxLength={100}
        />

        <div className={styles.formBottom}>
          <span>{contents.length}/100</span>
          <button type="submit" disabled={creating}>
            {creating ? "등록 중" : "댓글 등록"}
          </button>
        </div>
      </form>

      {loading && <p className={styles.empty}>댓글을 불러오는 중...</p>}

      <ul className={styles.commentList}>
        {data?.fetchBoardComments.map((comment) => (
          <li className={styles.comment} key={comment._id}>
            <span className={styles.avatar}>👤</span>
            <div className={styles.commentBody}>
              <div className={styles.commentTop}>
                <strong>{comment.writer}</strong>
                <span>{"★".repeat(comment.rating)}</span>
                <button
                  className={styles.editButton}
                  type="button"
                  aria-label="댓글 수정"
                  onClick={() => onClickEdit(comment)}
                >
                  <Image src="/icons/edit.svg" alt="" width={14} height={14} />
                </button>
                <button
                  type="button"
                  aria-label="댓글 삭제"
                  onClick={() => onClickDelete(comment._id)}
                >
                  <Image src="/icons/close.svg" alt="" width={14} height={14} />
                </button>
              </div>
              {editingId === comment._id ? (
                <div className={styles.editArea}>
                  <textarea
                    value={editingContents}
                    onChange={(event) => setEditingContents(event.target.value)}
                  />
                  <div>
                    <button type="button" onClick={() => setEditingId("")}>
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => onClickUpdate(comment)}
                    >
                      수정하기
                    </button>
                  </div>
                </div>
              ) : (
                <p>{comment.contents}</p>
              )}
              <time>{comment.createdAt.slice(0, 10).replaceAll("-", ".")}</time>
            </div>
          </li>
        ))}
      </ul>

      {!loading && data?.fetchBoardComments.length === 0 && (
        <p className={styles.empty}>첫 번째 댓글을 작성해 보세요.</p>
      )}
    </section>
  );
}
