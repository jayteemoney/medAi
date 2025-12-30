export interface HealthRecord {
  ipfsHash: string;
  timestamp: bigint;
  patient: `0x${string}`;
  recordType: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string | ArrayBuffer;
}

export type RecordType = 'consultation' | 'lab_result' | 'prescription' | 'imaging' | 'other';
