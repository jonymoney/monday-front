export interface User {
  id: string;
  email: string;
}

export interface FeedItem {
  id: string;
  userId: string;
  type: 'TASK' | 'EVENT' | 'REMINDER' | 'NOTIFICATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  expiresAt: string | null;
  title: string;
  subtitle: string | null;
  description: string;
  icon: string | null;
  color: string | null;
  imageUrl: string | null;
  source: {
    type: string;
    accountId: string;
    integrationName: string;
    sourceUrl?: string;
  };
  sourceId: string;
  metadataSchema: string | null;
  metadata: Record<string, any>;
  tags: string[];
  relatedItems: string[];
  context: any;
  status: 'NEW' | 'READ' | 'COMPLETED' | 'ARCHIVED' | 'SNOOZED';
  snoozeUntil: string | null;
  createdAt: string;
  updatedAt: string;
  actions: FeedAction[];
  interactionHistory: any[];
}

export interface FeedAction {
  id: string;
  type: string;
  label: string;
  description: string;
  params: Record<string, any>;
}

export interface FeedResponse {
  items: FeedItem[];
  count: number;
  limit: number;
  offset: number;
}

export interface QueryResponse {
  question: string;
  answer: string;
  sources?: any[];
  toolsUsed?: string[];
}

export interface ProfileData {
  name: string;
  birthday: string;
  homeAddress: string;
  workAddress: string;
  phone: string;
  preferences: {
    dietaryRestrictions: string[];
    commuteMethod: string;
    timezone: string;
  };
}

export interface Profile {
  id: string;
  userId: string;
  data: ProfileData;
  createdAt: string;
  updatedAt: string;
}
