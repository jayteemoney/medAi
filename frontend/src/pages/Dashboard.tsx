import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Clock, Plus, Activity } from 'lucide-react';
import { useHealthRecords } from '../hooks/useHealthRecords';
import { useAccount } from 'wagmi';

export function Dashboard() {
  const { address } = useAccount();
  const { records, recordCount, loadingRecords } = useHealthRecords();

  const recentRecords = records.slice(0, 3);

  const stats = [
    {
      label: 'Total Records',
      value: recordCount,
      icon: <FileText className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      label: 'This Month',
      value: records.filter(r => {
        const recordDate = new Date(Number(r.timestamp) * 1000);
        const now = new Date();
        return recordDate.getMonth() === now.getMonth();
      }).length,
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      change: '+8%',
    },
    {
      label: 'Last Upload',
      value: recordCount > 0 ? 'Today' : 'None',
      icon: <Clock className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500',
      change: '2h ago',
    },
  ];

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      consultation: 'bg-blue-100 text-blue-700 border-blue-200',
      lab_result: 'bg-green-100 text-green-700 border-green-200',
      prescription: 'bg-purple-100 text-purple-700 border-purple-200',
      imaging: 'bg-orange-100 text-orange-700 border-orange-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[type] || colors.other;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loadingRecords) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your health data overview
            </p>
          </div>
          <Link
            to="/add-record"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Record
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity"
                   style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              <div className="relative bg-white rounded-xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Records</h2>
                <Link
                  to="/records"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All →
                </Link>
              </div>

              {recentRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No records yet</p>
                  <Link
                    to="/add-record"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Add your first record →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRecords.map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {record.recordType[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">
                            {record.recordType.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(record.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRecordTypeColor(record.recordType)}`}>
                        {record.recordType}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <Activity className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold mb-2">Health Score</h3>
              <p className="text-3xl font-bold mb-2">85%</p>
              <p className="text-blue-100 text-sm">Based on your records</p>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-[85%]" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/add-record"
                  className="block w-full py-3 px-4 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors text-center"
                >
                  Upload New Record
                </Link>
                <Link
                  to="/records"
                  className="block w-full py-3 px-4 rounded-lg bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors text-center"
                >
                  View All Records
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Your Wallet</h3>
              <p className="text-sm text-gray-600 mb-2">Connected Address</p>
              <p className="font-mono text-xs text-gray-900 bg-gray-50 p-2 rounded break-all">
                {address}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
