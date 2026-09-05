// 1. 게시글 주소 세부 타입
export type BoardAddress = {
  zipcode?: string | null;
  address?: string | null;
  addressDetail?: string | null;
};

// 2. 게시글 전체 타입
export type Board = {
  _id: string;
  writer?: string | null;
  title: string;
  contents: string;
  youtubeUrl?: string | null; // 컴포넌트에서 사용하는 유튜브 링크 추가
  likeCount: number;
  dislikeCount?: number;
  boardAddress?: BoardAddress | null; // 끊겨있던 주소 객체 타입 지정
  images?: string[] | null;
  createdAt: string;
  updatedAt?: string;
};
