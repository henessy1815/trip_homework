"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";

export default function ProductWrite() {
  // 1. 폼 상태 관리
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState("");

  // 주소 및 위치 상태
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // 사진 첨부 상태
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. 필수 항목 유효성 검사 (등록하기 버튼 활성화 조건)
  const isValid =
    name.trim() !== "" &&
    summary.trim() !== "" &&
    description.trim() !== "" &&
    price.trim() !== "" &&
    zipcode.trim() !== "";

  // 임시 우편번호 검색 (클릭 시 주소 및 위경도 자동 입력 예시)
  const handleSearchZipcode = () => {
    // 실제 카카오 우편번호 서비스 연동 또는 임시 테스트 데이터 입력
    setZipcode("01234");
    setAddress("서울특별시 강동구 강일동");
    setLat("37.5658.347383.344");
    setLng("127.1723.347383.344");
  };

  // 사진 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    console.log("숙박권 판매 등록 데이터:", {
      name,
      summary,
      description,
      price,
      tag,
      zipcode,
      address,
      addressDetail,
      lat,
      lng,
      imageUrl,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>숙박권 판매하기</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 1. 상품명 */}
        <div className={styles.field}>
          <label className={styles.label}>
            상품명 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="상품명을 입력해 주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 2. 한줄 요약 */}
        <div className={styles.field}>
          <label className={styles.label}>
            한줄 요약 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="상품을 한줄로 요약해 주세요."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 3. 상품 설명 (에디터 툴바 + 내용) */}
        <div className={styles.field}>
          <label className={styles.label}>
            상품 설명 <span className={styles.required}>*</span>
          </label>
          <div className={styles.editorContainer}>
            {/* 에디터 상단 툴바 */}
            <div className={styles.editorToolbar}>
              <div className={styles.toolbarGroup}>
                <button type="button" className={styles.toolBtn}>
                  <b>B</b>
                </button>
                <button type="button" className={styles.toolBtn}>
                  <i>I</i>
                </button>
                <button type="button" className={styles.toolBtn}>
                  <u>U</u>
                </button>
                <button type="button" className={styles.toolBtn}>
                  A
                </button>
              </div>
              <span className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={styles.toolBtn}>
                  ≡
                </button>
                <button type="button" className={styles.toolBtn}>
                  ≣
                </button>
                <button type="button" className={styles.toolBtn}>
                  •≡
                </button>
              </div>
              <span className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={styles.toolBtn}>
                  🔗
                </button>
                <button type="button" className={styles.toolBtn}>
                  🖼️
                </button>
                <button type="button" className={styles.toolBtn}>
                  🙂
                </button>
              </div>
            </div>

            {/* 본문 입력 영역 */}
            <textarea
              className={styles.editorTextarea}
              placeholder="내용을 입력해 주세요."
              rows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <hr className={styles.divider} />

        {/* 4. 판매 가격 */}
        <div className={styles.field}>
          <label className={styles.label}>
            판매 가격 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="판매 가격을 입력해 주세요. (원 단위)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 5. 태그 입력 */}
        <div className={styles.field}>
          <label className={styles.label}>태그 입력</label>
          <input
            type="text"
            className={styles.input}
            placeholder="태그를 입력해 주세요."
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 6. 주소 & 상세 위치 (2열 배치) */}
        <div className={styles.locationSection}>
          {/* 좌측: 주소 및 위경도 */}
          <div className={styles.addressSide}>
            <div className={styles.field}>
              <label className={styles.label}>
                주소 <span className={styles.required}>*</span>
              </label>
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
                  onClick={handleSearchZipcode}
                >
                  우편번호 검색
                </button>
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="상세주소를 입력해 주세요."
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.subLabel}>위도(LAT)</label>
              <input
                type="text"
                className={`${styles.input} ${styles.readOnlyInput}`}
                placeholder="주소를 먼저 입력해 주세요."
                value={lat}
                readOnly
              />
            </div>

            <div className={styles.field}>
              <label className={styles.subLabel}>경도(LNG)</label>
              <input
                type="text"
                className={`${styles.input} ${styles.readOnlyInput}`}
                placeholder="주소를 먼저 입력해 주세요."
                value={lng}
                readOnly
              />
            </div>
          </div>

          {/* 우측: 상세 위치 (지도 박스) */}
          <div className={styles.mapSide}>
            <label className={styles.label}>상세 위치</label>
            <div className={styles.mapBox}>
              {address ? (
                <div className={styles.mapPreview}>
                  {/* 지도 API나 미리보기 지도 이미지 배치 */}
                  <span className={styles.mapPin}>📍</span>
                  <p className={styles.mapAddress}>{address}</p>
                </div>
              ) : (
                <span className={styles.mapPlaceholder}>
                  주소를 먼저 입력해 주세요.
                </span>
              )}
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* 7. 사진 첨부 */}
        <div className={styles.field}>
          <label className={styles.label}>사진 첨부</label>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {imageUrl ? (
            <div
              className={styles.previewBox}
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={imageUrl}
                alt="숙소 사진"
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={handleRemoveImage}
                title="사진 삭제"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.uploadBox}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className={styles.plusIcon}>+</span>
              <span className={styles.uploadText}>클릭해서 사진 업로드</span>
            </button>
          )}
        </div>

        {/* 8. 하단 액션 버튼 */}
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
