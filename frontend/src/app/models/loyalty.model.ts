export interface LoyaltyBalance {
  points: number;
  equivalentBrl: number;
  earnRatioBrl: number;
  redeemRatioPoints: number;
  maxRedeemFraction: number;
}

export interface LoyaltyTransaction {
  id: number;
  type: 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE';
  points: number;
  balanceAfter: number;
  description?: string;
  orderId?: number;
  createdAt: string;
}

export interface LoyaltyHistoryPage {
  content: LoyaltyTransaction[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
