import { useHealthRecords } from '../hooks/useHealthRecords';
import { getIPFSUrl } from '../lib/ipfs';
import type { HealthRecord } from '../types';
import { FileText, Calendar, ExternalLink, Loader2, FolderOpen } from 'lucide-react';

export function RecordsList() {
  const { records, loadingRecords, recordCount } = useHealthRecords();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRecordTypeInfo = (type: string) => {
    const types: Record<string, { label: string; icon: string; gradient: string; bgColor: string }> = {
      consultation: {
        label: 'Consultation',
        icon: '👨‍⚕️',
        gradient: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      lab_result: {
        label: 'Lab Result',
        icon: '🧪',
        gradient: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50 text-green-700 border-green-200'
      },
      prescription: {
        label: 'Prescription',
        icon: '💊',
        gradient: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 text-purple-700 border-purple-200'
      },
      imaging: {
        label: 'Imaging/X-Ray',
        icon: '🩻',
        gradient: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-50 text-orange-700 border-orange-200'
      },
      other: {
        label: 'Other',
        icon: '📋',
        gradient: 'from-gray-500 to-slate-500',
        bgColor: 'bg-gray-50 text-gray-700 border-gray-200'
      },
    };
    return types[type] || types.other;
  };

  if (loadingRecords) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-lg font-semibold text-gray-700">Loading your records...</span>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Health Records</h2>
            <p className="text-sm text-gray-500">View and manage your medical documents</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg">
          <span className="text-2xl">{recordCount}</span>
          <span className="text-sm">{recordCount === 1 ? 'Record' : 'Records'}</span>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <FolderOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No health records yet</h3>
          <p className="text-gray-600 mb-6">Start building your medical history by adding your first record</p>
          <a
            href="/add-record"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            <FileText className="w-5 h-5" />
            Add Your First Record
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record: HealthRecord, index: number) => {
            const typeInfo = getRecordTypeInfo(record.recordType);
            return (
              <div
                key={index}
                className="group relative border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-200 bg-linear-to-br from-white to-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${typeInfo.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                        {typeInfo.icon}
                      </div>
                      <div>
                        <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-bold border-2 ${typeInfo.bgColor}`}>
                          {typeInfo.label}
                        </span>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(record.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 font-semibold mb-1">IPFS Hash</p>
                      <code className="text-sm font-mono text-gray-800 break-all">
                        {record.ipfsHash}
                      </code>
                    </div>
                  </div>
                  <a
                    href={getIPFSUrl(record.ipfsHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all group-hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span className="hidden sm:inline">View File</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
