"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import styles from "./styles.module.css";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { CREATE_BOARD, UPDATE_BOARD } from "@/graphql/mutations";
import { uploadImage } from "@/lib/upload-image";
import type { Board } from "@/types/board";

type BoardWriteProps = {
  isEdit?: boolean;
  data?: Board;
  boardId?: string;
};

type DaumPostcode = new (options: {
  oncomplete: (data: { address: string; zonecode: string }) => void;
}) => { open: () => void };

declare global {
  interface Window {
    daum?: { Postcode: DaumPostcode };
  }
}

export default function BoardWrite({
  isEdit = false,
  data,
  boardId,
}: BoardWriteProps) {
  const router = useRouter();
  const [createBoard] = useMutation(CREATE_BOARD);
  const [updateBoard] = useMutation(UPDATE_BOARD);

  // 1. 텍스트 필드 상태 초기화
  const [writer, setWriter] = useState(data?.writer ?? "");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState(data?.title ?? "");
  const [contents, setContents] = useState(data?.contents ?? "");
  const [zipcode, setZipcode] = useState(data?.boardAddress?.zipcode ?? "");
  const [address, setAddress] = useState(data?.boardAddress?.address ?? "");
  const [addressDetail, setAddressDetail] = useState(
    data?.boardAddress?.addressDetail ?? "",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(data?.youtubeUrl ?? "");

  // 2. 이미지 상태 초기화 (수정 모드 시 기존 이미지 유지, 3칸 규격 맞춤)
  const [images, setImages] = useState<(string | null)[]>(() => {
    if (data?.images && data.images.length > 0) {
      const initial = [null, null, null] as (string | null)[];
      data.images.slice(0, 3).forEach((url, i) => {
        initial[i] = url;
      });
      return initial;
    }
    return [null, null, null];
  });

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 3. 주소 검색 팝업 열기
  const onClickAddressSearch = () => {
    const Postcode = window.daum?.Postcode;
    if (!Postcode) {
      alert(
        "주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }

    new Postcode({
      oncomplete: (addressData: { address: string; zonecode: string }) => {
        setAddress(addressData.address);
        setZipcode(addressData.zonecode);
      },
    }).open();
  };

  // 4. 입력 유효성 검사 (content -> contents 오타 수정)
  const isValid =
    writer.trim() !== "" &&
    password.trim() !== "" &&
    title.trim() !== "" &&
    contents.trim() !== "";

  const handleImageClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      const nextImages = [...images];
      nextImages[index] = uploadedUrl;
      setImages(nextImages);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "이미지 업로드에 실패했습니다.",
      );
    }
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextImages = [...images];
    nextImages[index] = null;
    setImages(nextImages);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  // 5. 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      alert("작성자, 비밀번호, 제목, 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const filteredImages = images.filter((img): img is string =>
        Boolean(img),
      );

      if (isEdit && boardId) {
        // 수정 모드
        await updateBoard({
          variables: {
            boardId,
            password,
            updateBoardInput: {
              title,
              contents,
              youtubeUrl,
              boardAddress: {
                zipcode,
                address,
                addressDetail,
              },
              images: filteredImages,
            },
          },
        });
        alert("게시글이 성공적으로 수정되었습니다.");
        router.push(`/boards/${boardId}`);
      } else {
        // 등록 모드
        const result = await createBoard({
          variables: {
            createBoardInput: {
              writer,
              password,
              title,
              contents,
              youtubeUrl,
              boardAddress: {
                zipcode,
                address,
                addressDetail,
              },
              images: filteredImages,
            },
          },
        });

        // result 뒤에 타입을 명시

        const newBoardId = (result.data as { createBoard?: { _id: string } })
          ?.createBoard?._id;
        alert("게시글이 성공적으로 등록되었습니다.");

        if (newBoardId) {
          router.push(`/boards/${newBoardId}`);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : isEdit
            ? "수정에 실패했습니다."
            : "등록에 실패했습니다.",
      );
    }
  };

  return (
    <div className={styles.container}>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <h1 className={styles.pageTitle}>
        {isEdit ? "게시물 수정" : "게시물 등록"}
      </h1>

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
              readOnly={isEdit}
              disabled={isEdit}
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
            value={contents}
            onChange={(e) => setContents(e.target.value)}
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

        {/* 사진 첨부 */}
        <div className={styles.field}>
          <label className={styles.label}>사진 첨부</label>
          <div className={styles.uploadGroup}>
            {images.map((imgUrl, index) => (
              <div key={index}>
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
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.back()}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`${styles.submitButton} ${isValid ? styles.active : ""}`}
          >
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
