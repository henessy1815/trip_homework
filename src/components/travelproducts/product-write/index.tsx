"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import dynamic from "next/dynamic";
import type { ChangeEvent, FormEvent } from "react";
import "react-quill-new/dist/quill.snow.css";
import { uploadImage } from "@/lib/upload-image";
import { CREATE_TRAVELPRODUCT } from "@/graphql/mutations";
import styles from "./styles.module.css";

type DaumPostcode = new (options: {
  oncomplete: (data: { address: string; zonecode: string }) => void;
}) => { open: () => void };

declare global {
  interface Window {
    daum?: { Postcode: DaumPostcode };
  }
}

type CreateData = {
  createTravelproduct: { _id: string };
};

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>에디터를 불러오는 중입니다...</p>,
});

const getImageUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  return `https://storage.googleapis.com/${path}`;
};

export default function ProductWrite() {
  const router = useRouter();
  // 1. 폼 상태 관리
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");

  // 주소 및 위치 상태
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [lat, setLat] = useState("37.5665");
  const [lng, setLng] = useState("126.9780");
  const [geocoding, setGeocoding] = useState(false);

  // 사진 첨부 상태
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const [createTravelproduct, { loading }] =
    useMutation<CreateData>(CREATE_TRAVELPRODUCT);

  const onClickAddressSearch = () => {
    const Postcode = window.daum?.Postcode;

    if (!Postcode) {
      alert("주소 검색 스크립트를 불러오는 중입니다.");
      return;
    }

    new Postcode({
      oncomplete: async (data) => {
        setAddress(data.address);
        setZipcode(data.zonecode);
        setGeocoding(true);

        try {
          // 선택한 주소를 좌표로 바꾼 뒤 위도·경도 state를 함께 갱신해요.
          const response = await fetch(
            `/api/geocode?address=${encodeURIComponent(data.address)}`,
          );
          const coordinate = (await response.json()) as {
            lat?: number;
            lng?: number;
            message?: string;
          };

          if (
            !response.ok ||
            coordinate.lat === undefined ||
            coordinate.lng === undefined
          ) {
            throw new Error(coordinate.message ?? "좌표를 찾지 못했어요.");
          }

          setLat(String(coordinate.lat));
          setLng(String(coordinate.lng));
        } catch (error) {
          alert(
            error instanceof Error ? error.message : "좌표 검색에 실패했어요.",
          );
        } finally {
          setGeocoding(false);
        }
      },
    }).open();
  };

  const onChangeFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });

    if (validFiles.length !== files.length) {
      alert("이미지 파일만 가능하며 파일당 5MB 이하여야 합니다.");
    }

    // 유효한 파일이 하나도 없으면 조기 종료
    if (validFiles.length === 0) return;

    try {
      setUploading(true);

      // 여러 파일 업로드가 모두 끝나면 URL 배열을 state에 저장해요.
      const uploadedUrls = await Promise.all(
        validFiles.map((file) => uploadImage(file)),
      );
      setImageUrl((previous) => [...previous, ...uploadedUrls]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "업로드에 실패했어요.");
    } finally {
      setUploading(false);
    }
  };

  // 2. 필수 항목 유효성 검사 (등록하기 버튼 활성화 조건)
  const isValid =
    name.trim() !== "" &&
    remarks.trim() !== "" &&
    contents.trim() !== "" &&
    price.trim() !== "" &&
    zipcode.trim() !== "";

  const handleRemoveImage =
    (indexToRemove: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setImageUrl((previous) =>
        previous.filter((_, idx) => idx !== indexToRemove),
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      alert("숙박권 정보와 가격을 입력해주세요.");
      return;
    }

    if (imageUrl.length === 0) {
      alert("이미지를 한 장 이상 업로드해 주세요.");
      return;
    }

    try {
      const result = await createTravelproduct({
        variables: {
          input: {
            name,
            remarks,
            contents,
            price: Number(price), // 숫자로 변환
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),
            images: imageUrl,
            travelproductAddress: {
              address,
              addressDetail,
              lat: Number(lat),
              lng: Number(lng),
            },
          },
        },
        context: { apiName: "practice" },
      });

      const productId = result.data?.createTravelproduct._id;
      if (productId) router.push(`/travelproducts/${productId}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "숙박권 등록에 실패했어요.",
      );
    }
  };

  const mapLat = Number(lat) || 37.5665;
  const mapLng = Number(lng) || 126.978;
  const mapUrl =
    `https://www.openstreetmap.org/export/embed.html?` +
    `bbox=${mapLng - 0.01}%2C${mapLat - 0.01}%2C${mapLng + 0.01}%2C${mapLat + 0.01}` +
    `&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <div className={styles.container}>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <h1 className={styles.pageTitle}>숙박권 판매하기</h1>

      <form className={styles.form} onSubmit={onSubmit}>
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
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 3. 상품 설명 (기존 editorContainer 클래스 유지) */}
        <div className={styles.field}>
          <label className={styles.label}>
            상품 설명 <span className={styles.required}>*</span>
          </label>
          <div className={styles.editorContainer}>
            <ReactQuill
              theme="snow"
              value={contents}
              onChange={setContents}
              placeholder="내용을 입력해 주세요."
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <hr className={styles.divider} />

        {/* 6. 주소 & 상세 위치 (기존 클래스 100% 유지) */}
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
                  onClick={onClickAddressSearch}
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

          {/* 우측: 상세 위치 (기존 mapSide, mapBox, mapPreview 클래스 유지) */}
          <div className={styles.mapSide}>
            <label className={styles.label}>상세 위치</label>
            <div className={styles.mapBox}>
              {address ? (
                <div
                  className={styles.mapPreview}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <iframe
                    title="위치 지도"
                    src={mapUrl}
                    style={{ width: "100%", height: "100%", border: 0 }}
                  />
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

        {/* 7. 사진 첨부 (기존 previewBox, previewImage, removeButton, uploadBox 클래스 그대로 사용) */}
        <div className={styles.field}>
          <label className={styles.label}>사진 첨부</label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={onChangeFiles}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((index) => {
              const url = imageUrl[index];

              return url ? (
                <div
                  key={index}
                  className={styles.previewBox}
                  style={{ position: "relative" }}
                >
                  <img
                    src={getImageUrl(url)}
                    alt={`숙소 사진 ${index + 1}`}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={handleRemoveImage(index)}
                    title="사진 삭제"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  key={index}
                  type="button"
                  className={styles.uploadBox}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <span className={styles.plusIcon}>+</span>
                  <span className={styles.uploadText}>
                    {uploading ? "업로드 중..." : "클릭해서 사진 업로드"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. 하단 액션 버튼 (기존 buttonGroup, cancelButton, submitButton 클래스 유지) */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.back()}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid || loading || uploading}
            className={`${styles.submitButton} ${isValid && !loading && !uploading ? styles.active : ""}`}
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
