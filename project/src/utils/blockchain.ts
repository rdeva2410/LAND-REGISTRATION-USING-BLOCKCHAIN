import { LandRecord, BlockchainTransaction } from '../types';

// Mock blockchain utility functions
export class BlockchainService {
  private static generateHash(data: string): string {
    // Simple hash generation for demo purposes
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  static createTransaction(landRecord: Omit<LandRecord, 'blockHash' | 'previousHash' | 'transactionHash'>): LandRecord {
    const dataString = JSON.stringify({
      ...landRecord,
      timestamp: Date.now()
    });
    
    const transactionHash = this.generateHash(dataString);
    const previousHash = this.getLastBlockHash();
    const blockHash = this.generateHash(transactionHash + previousHash);

    return {
      ...landRecord,
      blockHash,
      previousHash,
      transactionHash,
      isVerified: true
    };
  }

  static verifyRecord(registrationNumber: string, ownerNIC: string): { isValid: boolean; record?: LandRecord } {
    const storedRecords = this.getAllRecords();
    const record = storedRecords.find(r => 
      r.registrationNumber === registrationNumber && r.ownerNIC === ownerNIC
    );

    if (!record) {
      return { isValid: false };
    }

    // Verify blockchain integrity by reconstructing the original data
    const originalData = {
      id: record.id,
      registrationNumber: record.registrationNumber,
      ownerName: record.ownerName,
      ownerNIC: record.ownerNIC,
      propertyAddress: record.propertyAddress,
      district: record.district,
      province: record.province,
      landSize: record.landSize,
      landType: record.landType,
      registrationDate: record.registrationDate,
      lastVerified: record.lastVerified,
      isVerified: record.isVerified,
      documents: record.documents,
      coordinates: record.coordinates,
      timestamp: new Date(record.registrationDate).getTime()
    };
    
    const dataString = JSON.stringify(originalData);
    const expectedHash = this.generateHash(dataString);

    return {
      isValid: record.transactionHash === expectedHash,
      record
    };
  }

  static getAllRecords(): LandRecord[] {
    const stored = localStorage.getItem('landRecords');
    return stored ? JSON.parse(stored) : [];
  }

  static saveRecord(record: LandRecord): void {
    const records = this.getAllRecords();
    records.push(record);
    localStorage.setItem('landRecords', JSON.stringify(records));
  }

  private static getLastBlockHash(): string {
    const records = this.getAllRecords();
    return records.length > 0 ? records[records.length - 1].blockHash : '0000000000000000';
  }
}