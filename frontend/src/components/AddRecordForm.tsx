import { useState } from 'react';
import { useHealthRecords } from '../hooks/useHealthRecords';
import { uploadToIPFS, uploadJSONToIPFS } from '../lib/ipfs';
import type { RecordType } from '../types';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const RECORD_TYPES: { value: RecordType; label: string; icon: string }[] = [
  { value: 'consultation', label: 'Consultation', icon: '👨‍⚕️' },
  { value: 'lab_result', label: 'Lab Result', icon: '🧪' },
  { value: 'prescription', label: 'Prescription', icon: '💊' },
  { value: 'imaging', label: 'Imaging/X-Ray', icon: '🩻' },
  { value: 'other', label: 'Other', icon: '📋' },
];

export function AddRecordForm() {
  const { addRecord, isAdding } = useHealthRecords();
  const [recordType, setRecordType] = useState<RecordType>('consultation');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file && !notes) {
      setError('Please add a file or notes');
      return;
    }

    try {
      setUploading(true);

      let ipfsHash: string;
      if (file) {
        ipfsHash = await uploadToIPFS(file);
      } else {
        ipfsHash = await uploadJSONToIPFS({
          type: recordType,
          notes,
          timestamp: Date.now(),
        });
      }

      await addRecord(ipfsHash, recordType);

      setSuccess('Health record added successfully!');
      setNotes('');
      setFile(null);
      setRecordType('consultation');
    } catch (err: any) {
      setError(err.message || 'Failed to add record');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Health Record</h2>
          <p className="text-sm text-gray-500">Upload your medical documents securely</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Record Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RECORD_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setRecordType(type.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                  ${recordType === type.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-3xl">{type.icon}</span>
                <span className={`text-sm font-medium ${
                  recordType === type.value ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Upload File (Optional)
          </label>
          <div className={`
            relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
            ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}
          `}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2 text-center">
              {file ? (
                <>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <p className="font-semibold text-green-700">{file.name}</p>
                  <p className="text-sm text-green-600">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="font-medium text-gray-700">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC (Max 10MB)</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add any additional notes about this record..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isAdding || uploading}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading to IPFS...</span>
            </>
          ) : isAdding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Adding to Blockchain...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Add Record</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
