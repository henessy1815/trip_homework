export type Travelproduct = {
  _id: string;
  name: string;
  remarks: string;
  contents?: string;
  price: number;
  tags?: string[];
  images?: string[];
  pickedCount: number;
  createdAt?: string;
  seller: { name: string };
  travelproductAddress?: {
    address?: string;
    addressDetail?: string;
    lat?: number;
    lng?: number;
  };
};

export type TravelproductQuestion = {
  _id: string;
  contents: string;
  createdAt: string;
  user: { name: string };
};

export type TravelproductAnswer = TravelproductQuestion;
