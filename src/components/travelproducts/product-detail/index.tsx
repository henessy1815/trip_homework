"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  CREATE_TRAVELPRODUCT_QUESTION,
  CREATE_TRAVELPRODUCT_QUESTION_ANSWER,
  DELETE_TRAVELPRODUCT_QUESTION_ANSWER,
  UPDATE_TRAVELPRODUCT_QUESTION_ANSWER,
} from "@/graphql/mutations";
import {
  FETCH_TRAVELPRODUCT,
  FETCH_TRAVELPRODUCT_QUESTIONS,
  FETCH_TRAVELPRODUCT_QUESTION_ANSWERS,
} from "@/graphql/queries";
import type {
  Travelproduct,
  TravelproductAnswer,
  TravelproductQuestion,
} from "@/types/travelproduct";
import styles from "./styles.module.css";

const FALLBACK_IMAGES = ["/images/a.png", "/images/b.png", "/images/c.png"];

const getImageUrl = (path?: string) => {
  if (!path) return FALLBACK_IMAGES[0];
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `https://storage.googleapis.com/${path}`;
};

const removeHtmlTags = (contents?: string) =>
  contents?.replace(/<[^>]*>/g, "") ?? "등록된 상세 설명이 없어요.";

// 문의 한 개에 달린 답변을 조회하고 등록하는 영역이에요.
function AnswerArea({ questionId }: { questionId: string }) {
  const [contents, setContents] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editingContents, setEditingContents] = useState("");

  const { data, refetch } = useQuery<{
    fetchTravelproductQuestionAnswers: TravelproductAnswer[];
  }>(FETCH_TRAVELPRODUCT_QUESTION_ANSWERS, {
    variables: { questionId, page: 1 },
    ssr: false,
  });

  const [createAnswer, { loading }] = useMutation(
    CREATE_TRAVELPRODUCT_QUESTION_ANSWER,
  );
  const [updateAnswer] = useMutation(UPDATE_TRAVELPRODUCT_QUESTION_ANSWER);
  const [deleteAnswer] = useMutation(DELETE_TRAVELPRODUCT_QUESTION_ANSWER);

  const onSubmitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contents.trim()) return;

    try {
      await createAnswer({ variables: { questionId, contents } });
      setContents("");
      setIsWriting(false);
      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "답변 등록에 실패했어요.");
    }
  };

  const onClickUpdate = async (answerId: string) => {
    if (!editingContents.trim()) return;

    try {
      await updateAnswer({
        variables: { answerId, contents: editingContents },
      });
      setEditingId("");
      setEditingContents("");
      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "답변 수정에 실패했어요.");
    }
  };

  const onClickDelete = async (answerId: string) => {
    if (!confirm("답변을 삭제할까요?")) return;

    try {
      await deleteAnswer({ variables: { answerId } });
      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "답변 삭제에 실패했어요.");
    }
  };

  return (
    <div>
      <ul className={styles.replyList}>
        {data?.fetchTravelproductQuestionAnswers.map((answer) => (
          <li className={styles.reply} key={answer._id}>
            {editingId === answer._id ? (
              <>
                <textarea
                  value={editingContents}
                  onChange={(event) => setEditingContents(event.target.value)}
                />
                <div className={styles.replyButtonRow}>
                  <button type="button" onClick={() => setEditingId("")}>
                    취소
                  </button>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    onClick={() => onClickUpdate(answer._id)}
                  >
                    수정하기
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.commentHeader}>
                  <span className={styles.avatar}>👤</span>
                  <strong>{answer.user.name}</strong>

                  <div className={styles.replyIcons}>
                    <button
                      type="button"
                      aria-label="답변 수정"
                      onClick={() => {
                        setEditingId(answer._id);
                        setEditingContents(answer.contents);
                      }}
                    >
                      <Image
                        src="/icons/edit.svg"
                        alt=""
                        width={14}
                        height={14}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="답변 삭제"
                      onClick={() => onClickDelete(answer._id)}
                    >
                      <Image
                        src="/icons/close.svg"
                        alt=""
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>

                <p className={styles.commentContent}>{answer.contents}</p>
                <time>
                  {answer.createdAt.slice(0, 10).replaceAll("-", ".")}
                </time>
              </>
            )}
          </li>
        ))}
      </ul>

      {!isWriting && (
        <div className={styles.replyOpenRow}>
          <button type="button" onClick={() => setIsWriting(true)}>
            <Image src="/icons/chat.svg" alt="" width={20} height={20} />
            답변 하기
          </button>
        </div>
      )}

      {isWriting && (
        <form className={styles.replyForm} onSubmit={onSubmitAnswer}>
          <textarea
            value={contents}
            onChange={(event) => setContents(event.target.value)}
            placeholder="답변을 입력해 주세요."
          />
          <div className={styles.replyButtonRow}>
            <button type="button" onClick={() => setIsWriting(false)}>
              취소
            </button>
            <button
              className={styles.primaryButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "등록 중" : "답변 하기"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

type ProductDetailProps = {
  productId: string;
};

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [inquiry, setInquiry] = useState("");

  const productResult = useQuery<{ fetchTravelproduct: Travelproduct }>(
    FETCH_TRAVELPRODUCT,
    {
      variables: { travelproductId: productId },
      ssr: false,
    },
  );

  const questionResult = useQuery<{
    fetchTravelproductQuestions: TravelproductQuestion[];
  }>(FETCH_TRAVELPRODUCT_QUESTIONS, {
    variables: { travelproductId: productId, page: 1 },
    ssr: false,
  });

  const [createQuestion, { loading: creating }] = useMutation(
    CREATE_TRAVELPRODUCT_QUESTION,
  );

  const onSubmitQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inquiry.trim()) return;

    try {
      await createQuestion({
        variables: { travelproductId: productId, contents: inquiry },
      });
      setInquiry("");
      await questionResult.refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : "문의 등록에 실패했어요.");
    }
  };

  if (productResult.loading) {
    return <p className={styles.emptyState}>숙박권을 불러오고 있어요...</p>;
  }

  if (productResult.error || !productResult.data) {
    return <p className={styles.emptyState}>숙박권을 불러오지 못했어요.</p>;
  }

  const product = productResult.data.fetchTravelproduct;
  const images = product.images?.filter((image) => image !== "") ?? [];
  const latitude = product.travelproductAddress?.lat;
  const longitude = product.travelproductAddress?.lng;
  const hasCoordinates = latitude !== undefined && longitude !== undefined;
  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : "";

  return (
    <article className={styles.article}>
      <div className={styles.topRow}>
        <div>
          <h1>{product.name}</h1>
          <p className={styles.subtitle}>{product.remarks}</p>
          <p className={styles.tags}>{product.tags?.join(" ")}</p>
        </div>

        <div className={styles.metaIcons}>
          <button type="button" aria-label="삭제">
            <Image src="/icons/delete.svg" alt="" width={18} height={18} />
          </button>
          <button type="button" aria-label="링크 복사">
            <Image src="/icons/link.svg" alt="" width={18} height={18} />
          </button>
          <span className={styles.dateBadge}>
            <Image src="/icons/bookmark.svg" alt="" width={14} height={14} />
            {product.pickedCount}
          </span>
        </div>
      </div>

      <div className={styles.mainRow}>
        <div className={styles.gallery}>
          <img
            className={styles.mainImage}
            src={getImageUrl(images[0])}
            alt={product.name}
          />

          <div className={styles.thumbList}>
            {[0, 1, 2].map((index) => (
              <img
                src={getImageUrl(images[index] ?? FALLBACK_IMAGES[index])}
                alt={`${product.name} 사진 ${index + 1}`}
                key={index}
              />
            ))}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.priceBox}>
            <strong>{product.price.toLocaleString()}원</strong>
            <ul>
              <li>숙박권의 상세 설명과 사진을 꼭 확인해 주세요.</li>
              <li>구매 기능은 다음 수업에서 API를 연결할 예정이에요.</li>
            </ul>
            <button className={styles.buyButton} type="button">
              구매하기
            </button>
          </div>

          <div className={styles.sellerBox}>
            <strong>판매자</strong>
            <div className={styles.seller}>
              <span className={styles.avatar}>👤</span>
              <span>{product.seller?.name ?? "판매자"}</span>
            </div>
          </div>
        </aside>
      </div>

      <section className={styles.section}>
        <h2>상세 설명</h2>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: product.contents ?? "등록된 상세 설명이 없어요.",
          }}
        />
      </section>

      <section className={styles.section}>
        <h2>상세 위치</h2>
        <p className={styles.addressText}>
          <Image src="/icons/location.svg" alt="" width={22} height={22} />
          {product.travelproductAddress?.address || "등록된 주소가 없어요."}
          {product.travelproductAddress?.addressDetail
            ? ` ${product.travelproductAddress.addressDetail}`
            : ""}
        </p>

        {hasCoordinates ? (
          <iframe
            className={styles.mapFrame}
            src={mapUrl}
            title="숙박권 위치 지도"
            loading="lazy"
          />
        ) : (
          <div className={styles.mapBox}>등록된 위치 좌표가 없어요.</div>
        )}
      </section>

      <section className={styles.section}>
        <h2>문의하기</h2>
        <form onSubmit={onSubmitQuestion}>
          <div className={styles.inquiryBox}>
            <textarea
              maxLength={100}
              value={inquiry}
              onChange={(event) => setInquiry(event.target.value)}
              placeholder="문의사항을 입력해 주세요."
            />
            <span className={styles.charCount}>{inquiry.length}/100</span>
          </div>

          <div className={styles.inquiryButtonRow}>
            <button
              className={styles.inquiryButton}
              type="submit"
              disabled={!inquiry.trim() || creating}
            >
              {creating ? "등록 중" : "문의 하기"}
            </button>
          </div>
        </form>

        {questionResult.loading && (
          <p className={styles.emptyState}>문의를 불러오고 있어요...</p>
        )}

        <ul className={styles.commentList}>
          {questionResult.data?.fetchTravelproductQuestions.map((question) => (
            <li className={styles.comment} key={question._id}>
              <div className={styles.commentHeader}>
                <span className={styles.avatar}>👤</span>
                <strong>{question.user.name}</strong>
              </div>
              <p className={styles.commentContent}>{question.contents}</p>
              <div className={styles.commentFooter}>
                <time>
                  {question.createdAt.slice(0, 10).replaceAll("-", ".")}
                </time>
              </div>
              <AnswerArea questionId={question._id} />
            </li>
          ))}
        </ul>

        {!questionResult.loading &&
          questionResult.data?.fetchTravelproductQuestions.length === 0 && (
            <p className={styles.emptyState}>등록된 문의사항이 없어요.</p>
          )}
      </section>
    </article>
  );
}
