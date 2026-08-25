export type Board = {
  _id: string;
  writer?: string | null;
  title: string;
  contents: string;
  likeCount: number;
  images?: string[] | null;
  createdAt: string;
};
