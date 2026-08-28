"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

// 댓글 및 답글 타입 정의 추가
type ReplyItem = {
  id: number;
  writer: string;
  avatar: string;
  content: string;
  date: string;
};
type CommentItem = {
  id: number;
  writer: string;
  avatar: string | null;
  content: string;
  date: string;
  replies: ReplyItem[];
};

// 화면 확인용 문의/답변 더미 데이터
const DUMMY_COMMENTS: CommentItem[] = [
  {
    id: 1,
    writer: "홍길동",
    avatar: "/images/a.png",
    content:
      "살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n알리알리 알랑성 알라리 알라",
    date: "2024.11.11",
    replies: [],
  },
  {
    id: 2,
    writer: "자유로운 실버",
    avatar: "/images/b.png",
    content:
      "살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n알리알리 알랑성 알라리 알라",
    date: "2024.11.11",
    replies: [
      {
        id: 21,
        writer: "판매자",
        avatar: "/images/b.png",
        content:
          "살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n알리알리 알랑성 알라리 알라",
        date: "2024.11.11",
      },
      {
        id: 22,
        writer: "판매자",
        avatar: "/images/b.png",
        content:
          "살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n알리알리 알랑성 알라리 알라",
        date: "2024.11.11",
      },
    ],
  },
  {
    id: 3,
    writer: "둘리",
    avatar: null,
    content:
      "살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n알리알리 알랑성 알라리 알라",
    date: "2024.11.11",
    replies: [],
  },
];

type ProductDetailProps = {
  productId: string;
};

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [comment, setComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>(DUMMY_COMMENTS);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const isCommentValid = comment.trim().length > 0;
  const isReplyValid = replyText.trim().length > 0;

  const handleDeleteReply = (commentId: number, replyId: number) => {
    if (confirm("답변을 삭제하시겠습니까?")) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
            : c,
        ),
      );
    }
  };

  const handleStartEdit = (replyId: number, currentContent: string) => {
    setEditingReplyId(replyId);
    setEditText(currentContent);
  };

  const handleSaveEdit = (commentId: number, replyId: number) => {
    if (!editText.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r.id === replyId ? { ...r, content: editText } : r,
              ),
            }
          : c,
      ),
    );
    setEditingReplyId(null); // 수정 모드 종료
    setEditText("");
  };

  return (
    <div className={styles.container}>
      {/* 1. 상단 타이틀 & 헤더 */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>포항 : 숙박권 명이 여기에 들어갑니다</h1>
          <p className={styles.subtitle}>모던한 분위기의 감도높은 숙소</p>
          <div className={styles.tags}>
            <span>#6인 이하</span>
            <span>#건식 사우나</span>
            <span>#애견동반 가능</span>
          </div>
        </div>
        {/* 우측 아이콘 그룹 */}
        <div className={styles.iconGroup}>
          <button type="button" className={styles.iconBtn} title="삭제">
            <Image src="/icons/delete.svg" alt="삭제" width={20} height={20} />
          </button>
          <button type="button" className={styles.iconBtn} title="링크 복사">
            <Image src="/icons/link.svg" alt="링크" width={20} height={20} />
          </button>
          <button type="button" className={styles.iconBtn} title="위치">
            <Image
              src="/icons/location.svg"
              alt="위치"
              width={20}
              height={20}
            />
          </button>
          <button
            type="button"
            className={`${styles.bookmarkBadge} ${isBookmarked ? styles.activeBookmark : ""}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Image
              src="/icons/bookmark.svg"
              alt="북마크"
              width={16}
              height={16}
            />
            <span>24</span>
          </button>
        </div>
      </div>
      {/* 2. 메인 사진 갤러리 & 우측 구매 사이드바 */}
      <div className={styles.mainSection}>
        {/* 이미지 갤러리 (좌측 큰 이미지 + 우측 썸네일 3개) */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <img src="/images/a.png" alt="메인 숙소 사진" />
          </div>
          <div className={styles.thumbList}>
            <img src="/images/b.png" alt="썸네일 1" />
            <img src="/images/c.png" alt="썸네일 2" />
            <img src="/images/d.png" alt="썸네일 3" />
          </div>
        </div>
        {/* 우측 사이드바 (가격 및 구매 / 판매자 정보) */}
        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <strong className={styles.price}>32,500원</strong>
            <ul className={styles.noticeList}>
              <li>
                숙박권은 트립트립에서 포인트 충전 후 구매하실 수 있습니다.
              </li>
              <li>상세 설명에 숙박권 사용기한을 꼭 확인해 주세요.</li>
            </ul>
            <button type="button" className={styles.buyButton}>
              구매하기
            </button>
          </div>
          <div className={styles.sellerCard}>
            <span className={styles.sellerLabel}>판매자</span>
            <div className={styles.sellerProfile}>
              <div className={styles.sellerAvatar}>
                <img src="/images/b.png" alt="판매자 프로필" />
              </div>
              <span className={styles.sellerName}>김남일</span>
            </div>
          </div>
        </aside>
      </div>
      <hr className={styles.divider} />
      {/* 3. 상세 설명 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>상세 설명</h2>
        <div className={styles.description}>
          <p>
            살어리 살어리랏다 청산(靑山)애 살어리랏다 멀위랑 ᄃᆞ래랑 먹고
            청산(靑山)애 살어리랏다 얄리얄리 얄랑셩 얄라리 얄라 우러라 우러라
            새여 자고 니러 우러라 새여 널라와 시름 한 나도 자고 니러 우니로라
            리얄리 얄라셩 얄라리 얄라 가던 새 가던 새 본다 물 아래 가던 새 본다
            잉무든 장글란 가지고 물 아래 가던 새 본다 얄리얄리 얄라셩 얄라리
            얄라
          </p>
          <p>
            이링공 뎌링공 후야 나즈란 디내와손뎌
            <br />
            오리도 가리도 업슨 바므란 또 엇디 호리라
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            어디라 더디던 돌코 누리라 마치던 돌코
            <br />
            믜리도 괴리도 업시 마자셔 우니노라
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            살어리 살어리랏다 바루래 살어리랏다
            <br />
            ᄂᆞᄆᆞ자기 구조개랑 먹고 바루래 살어리랏다
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            가다가 가다가 드로라 에정지 가다가 드로라
            <br />
            사ᄉᆞ미 즛대예 올라셔 奚琴(해금)을 혀거를 드로라
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
          <p>
            가다니 븨브른 도긔 설진 강수를 비조라
            <br />
            조롱곳 누로기 ᄆᆡ와 잡ᄉᆞ와니 내 엇디 ᄒᆞ리잇고
            <br />
            얄리얄리 얄라셩 얄라리 얄라
          </p>
        </div>
      </section>
      <hr className={styles.divider} />
      {/* 4. 상세 위치 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>상세 위치</h2>
        <div className={styles.mapBox}>
          {/* 지도 이미지 또는 지도 컴포넌트 */}
          <div className={styles.mapPlaceholder}>
            <span>📍 서울특별시 강동구 강일동</span>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* 5. 문의하기 */}
      <section className={styles.section}>
        <div className={styles.commentHeader}>
          <span>💬 문의하기</span>
        </div>
        <div className={styles.commentBox}>
          <textarea
            className={styles.commentTextarea}
            placeholder="문의사항을 입력해 주세요."
            maxLength={100}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className={styles.commentBottom}>
            <span className={styles.charCount}>{comment.length}/100</span>
          </div>
        </div>
        <div className={styles.commentButtonWrapper}>
          <button
            type="button"
            disabled={!isCommentValid}
            className={`${styles.commentSubmitButton} ${isCommentValid ? styles.active : ""}`}
          >
            문의 하기
          </button>
        </div>
      </section>

      {/* 6. 문의 및 답변 리스트 영역 */}
      <div className={styles.commentListSection}>
        {comments.map((item) => (
          <div key={item.id} className={styles.commentItemWrapper}>
            {/* 원글(문의) */}
            <div className={styles.commentCard}>
              <div className={styles.commentUser}>
                <div className={styles.avatar}>
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.writer} />
                  ) : (
                    <Image
                      src="/icons/person.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  )}
                </div>
                <span className={styles.commentUserName}>{item.writer}</span>
              </div>
              <p className={styles.commentContent}>{item.content}</p>
              <span className={styles.commentDate}>{item.date}</span>
              <button
                type="button"
                className={styles.replyButton}
                onClick={() =>
                  setReplyOpenId(replyOpenId === item.id ? null : item.id)
                }
              >
                <Image src="/icons/chat.svg" alt="" width={16} height={16} />
                <span>답변 하기</span>
              </button>
            </div>
            {/* 대댓글(답변) 목록 */}
            {item.replies.length > 0 && (
              <div className={styles.repliesList}>
                {item.replies.map((reply) => (
                  <div key={reply.id} className={styles.replyCard}>
                    <div className={styles.replyArrow}>↳</div>
                    <div className={styles.replyBody}>
                      <div className={styles.replyHeader}>
                        <div className={styles.commentUser}>
                          <div className={styles.avatar}>
                            <img src={reply.avatar} alt={reply.writer} />
                          </div>
                          <span className={styles.commentUserName}>
                            {reply.writer}
                          </span>
                        </div>

                        {/* 1. 수정/삭제 버튼에 onClick 연결 */}
                        <div className={styles.replyActions}>
                          <button
                            type="button"
                            className={styles.actionBtn}
                            title="수정"
                            onClick={() =>
                              handleStartEdit(reply.id, reply.content)
                            }
                          >
                            <Image
                              src="/icons/edit.svg"
                              alt="수정"
                              width={14}
                              height={14}
                            />
                          </button>
                          <button
                            type="button"
                            className={styles.actionBtn}
                            title="삭제"
                            onClick={() => handleDeleteReply(item.id, reply.id)}
                          >
                            <Image
                              src="/icons/close.svg"
                              alt="삭제"
                              width={14}
                              height={14}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 👉 2. 지금 이 답글이 '수정 중'이면 수정창을, 아니면 '원래 글'을 보여줌 */}
                      {editingReplyId === reply.id ? (
                        <div className={styles.editBox}>
                          <textarea
                            className={styles.commentTextarea}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                          />
                          <div className={styles.editButtonGroup}>
                            <button
                              type="button"
                              className={styles.cancelBtn}
                              onClick={() => setEditingReplyId(null)}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              className={`${styles.submitBtn} ${styles.active}`}
                              onClick={() => handleSaveEdit(item.id, reply.id)}
                            >
                              수정 완료
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={styles.commentContent}>
                            {reply.content}
                          </p>
                          <span className={styles.commentDate}>
                            {reply.date}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* 답변 작성 폼 (답변 하기 클릭 시 표시) */}
            {replyOpenId === item.id && (
              <div className={styles.replyFormBox}>
                <div className={styles.commentBox}>
                  <textarea
                    className={styles.commentTextarea}
                    placeholder="답변할 내용을 입력해 주세요."
                    maxLength={100}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className={styles.commentBottom}>
                    <span className={styles.charCount}>
                      {replyText.length}/100
                    </span>
                  </div>
                </div>
                <div className={styles.replyButtonGroup}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setReplyOpenId(null)}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    disabled={!isReplyValid}
                    className={`${styles.submitBtn} ${isReplyValid ? styles.active : ""}`}
                  >
                    답변 하기
                  </button>
                </div>
              </div>
            )}
            <hr className={styles.commentDivider} />
          </div>
        ))}
      </div>
    </div>
  );
}
