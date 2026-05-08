export interface PropertyImage {
  id: string;
  url: string;
}

export interface Review {
  id: string;
  user: string;
  avatar?: string;
  comment: string;
  rating: number;
  datetime?: string;
  userImages?: string[];
}

export interface PropertyDetail {
  id: string;
  images: PropertyImage[];
  title: string;
  description: string;
  rating: number;
  totalReviews: number;
  address: string;
  price: number;
  isFavorite: boolean;
  reviews: Review[];
  convenient: string[];
}
