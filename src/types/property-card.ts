export interface PropertyCardProps {
  id: string;
  imageUrl: string;
  isFavorite?: boolean;
  title: string;
  description: string;
  rating: number;
  address: string;
  price: number;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}
