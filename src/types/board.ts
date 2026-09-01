export type Board = {
  _id: string;
  writer?: string | null;
  title: string;
  contents: string;
  likeCount: number;
  dislikeCount?: number;
  images?: string[] | null;
  createdAt: string;
};
