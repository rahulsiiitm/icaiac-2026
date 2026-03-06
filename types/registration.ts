export interface Registration {
  id: string;
  userId: string;
  category: string;
  region: string;
  institution: string;
  designation: string;
  phoneNumber: string;
  payment?: {
    id: string;
    status: string;
    transactionId: string;
    receiptUrl: string;
  } | null;
}