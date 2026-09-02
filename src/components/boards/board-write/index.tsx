"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import styles from "./styles.module.css";

type DaumPostcode = new (options: {
  oncomplete: (data: { address: string; zonecode: string }) => void;
}) => { open: () => void };

declare global {
  interface Window {
    daum?: { Postcode: DaumPostcode };
  }
}

export default function BoardWrite() {
  // 1. 입력 필드 상태 관리
  const [writer, setWriter] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // 주소 검색 팝업 열기
  const onClickAddressSearch = () => {
    const Postcode = window.daum?.Postcode;
    if (!Postcode) {
      alert(
        "주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }

    new Postcode({
      oncomplete: (data: { address: string; zonecode: string }) => {
        setAddress(data.address);
        setZipcode(data.zonecode);
      },
    }).open();
  };

  // 2. 이미지 3개 상태 (미리보기 URL 문자열 또는 null)
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 3. 필수 항목이 모두 채워졌는지 검사 (버튼 활성화 조건)
  const isValid =
    writer.trim() !== "" &&
    password.trim() !== "" &&
    title.trim() !== "" &&
    content.trim() !== "";

  // 사진 클릭 시 숨겨진 input[type="file"] 실행
  const handleImageClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  // 사진 파일 선택 시 미리보기 URL 생성
  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const nextImages = [...images];
      nextImages[index] = previewUrl;
      setImages(nextImages);
    }
  };

  // 사진 삭제(X) 버튼 클릭 시
  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭(파일 선택) 방지
    const nextImages = [...images];
    nextImages[index] = null;
    setImages(nextImages);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    console.log("등록 완료:", {
      writer,
      password,
      title,
      content,
      zipcode,
      address,
      addressDetail,
      youtubeUrl,
      images,
    });
  };

  return (
    <div className={styles.container}>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <h1 className={styles.pageTitle}>게시물 등록</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 작성자 & 비밀번호 */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              작성자 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="작성자 명을 입력해 주세요."
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              비밀번호 <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              className={styles.input}
              placeholder="비밀번호를 입력해 주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <hr className={styles.divider} />

        {/* 제목 */}
        <div className={styles.field}>
          <label className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 내용 */}
        <div className={styles.field}>
          <label className={styles.label}>
            내용 <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="내용을 입력해 주세요."
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 주소 */}
        <div className={styles.field}>
          <label className={styles.label}>주소</label>
          <div className={styles.zipcodeRow}>
            <input
              type="text"
              className={`${styles.input} ${styles.zipcodeInput}`}
              placeholder="01234"
              value={zipcode}
              readOnly
            />
            <button
              type="button"
              className={styles.zipcodeButton}
              onClick={onClickAddressSearch}
            >
              우편번호 검색
            </button>
          </div>
          <input
            type="text"
            className={styles.input}
            placeholder="주소를 입력해 주세요."
            value={address}
            readOnly
          />
          <input
            type="text"
            className={styles.input}
            placeholder="상세주소"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 유튜브 링크 */}
        <div className={styles.field}>
          <label className={styles.label}>유튜브 링크</label>
          <input
            type="text"
            className={styles.input}
            placeholder="링크를 입력해 주세요."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>

        {/* 사진 첨부 (미리보기 & 삭제 지원) */}
        <div className={styles.field}>
          <label className={styles.label}>사진 첨부</label>
          <div className={styles.uploadGroup}>
            {images.map((imgUrl, index) => (
              <div key={index}>
                {/* 숨겨진 파일 인풋 */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleFileChange(index, e)}
                />

                {imgUrl ? (
                  /* 1) 이미지가 첨부된 경우 (미리보기 + 삭제 버튼) */
                  <div
                    className={styles.previewBox}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={imgUrl}
                      alt={`첨부사진 ${index + 1}`}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={(e) => handleRemoveImage(index, e)}
                      title="사진 삭제"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  /* 2) 이미지가 없는 경우 (업로드 기본 박스) */
                  <button
                    type="button"
                    className={styles.uploadBox}
                    onClick={() => handleImageClick(index)}
                  >
                    <span className={styles.plusIcon}>+</span>
                    <span className={styles.uploadText}>
                      클릭해서 사진 업로드
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton}>
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`${styles.submitButton} ${isValid ? styles.active : ""}`}
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
