export type User = {
  _id: string;
  email: string;
  name: string;
  picture?: string | null;
  userPoint?: {
    amount: number;
  } | null;
};
