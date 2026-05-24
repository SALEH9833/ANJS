export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
  order: number;
  isActive: boolean;
}

export interface Volunteer {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  bio: string | null;
  school?: { name: string; city: string } | null;
}

export interface School {
  id: number;
  name: string;
  city: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  description: string | null;
  _count?: { volunteers: number };
}

export interface Partner {
  id: number;
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  website: string | null;
  city: string | null;
  description: string | null;
}

export interface AidRequest {
  id: number;
  category: string;
  title: string;
  description: string | null;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  status: string;
}

export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content?: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
}

export interface DonationStats {
  totalAmount: number;
  totalDonors: number;
}

export interface AdminStats {
  volunteers: { total: number; active: number };
  schools: number;
  partners: number;
  beneficiaries: { total: number; helped: number };
  aidRequests: { total: number; PENDING?: number; IN_PROGRESS?: number; FULFILLED?: number };
  donations: { totalAmount: number; totalConfirmed: number };
  events: { upcoming: number };
  articles: { published: number };
  contacts: { unread: number };
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MediaAsset {
  id: number;
  filename: string;
  url: string;
  altText: string | null;
  category: string;
  sizeBytes: number | null;
  createdAt: string;
}

export interface Beneficiary {
  id: number;
  fullName: string;
  age: number | null;
  city: string | null;
  householdSize: number | null;
  needsSummary: string | null;
  status: string;
  aidRequests?: AidRequest[];
}

export interface Donation {
  id: number;
  donorName: string | null;
  donorEmail: string | null;
  donorPhone: string | null;
  amount: number;
  paymentMethod: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
}
