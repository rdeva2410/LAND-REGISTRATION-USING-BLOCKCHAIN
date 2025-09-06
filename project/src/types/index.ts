export interface LandRecord {
  id: string;
  registrationNumber: string;
  ownerName: string;
  ownerNIC: string; // 12-digit Aadhaar number
  propertyAddress: string;
  district: string;
  province: string;
  landSize: number;
  landType: string;
  registrationDate: Date;
  lastVerified: Date;
  blockHash: string;
  previousHash: string;
  transactionHash: string;
  isVerified: boolean;
  documents: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface VerificationResult {
  isValid: boolean;
  record?: LandRecord;
  message: string;
  verificationTime: Date;
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  data: any;
  previousHash: string;
}