export interface Review {
  id: number;
  productId: number;
  productName?: string;
  orderId: number;
  userName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewSummary {
  count: number;
  average: number;
  distribution: { [rating: number]: number };
}

export interface ReviewableItem {
  orderId: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
}

export interface CreateReviewRequest {
  productId: number;
  orderId: number;
  rating: number;
  comment?: string;
}
