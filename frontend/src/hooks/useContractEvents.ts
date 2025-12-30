import { useWatchContractEvent } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import contractData from '../contracts/HealthRecordRegistry.json';
import toast from 'react-hot-toast';

const CONTRACT_ADDRESS = contractData.address as `0x${string}`;
const CONTRACT_ABI = contractData.abi;

interface RecordAddedEventArgs {
  patient: string;
  recordType: string;
  ipfsHash: string;
  timestamp: bigint;
  recordIndex: bigint;
}

interface RecordAccessedEventArgs {
  patient: string;
  accessor: string;
  recordIndex: bigint;
  timestamp: bigint;
}

export function useRecordAddedEvent(address?: `0x${string}`) {
  const queryClient = useQueryClient();

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'RecordAdded',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const { patient, recordType } = log.args as RecordAddedEventArgs;

        // Only show notification if it's the current user's record
        if (address && patient.toLowerCase() === address.toLowerCase()) {
          toast.success(`New ${recordType.replace('_', ' ')} record added!`, {
            duration: 4000,
            position: 'bottom-right',
          });

          // Invalidate queries to refetch records
          queryClient.invalidateQueries({ queryKey: ['readContract'] });
        }
      });
    },
  });
}

export function useRecordAccessedEvent(address?: `0x${string}`) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'RecordAccessed',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const { patient, accessor } = log.args as RecordAccessedEventArgs;

        // Notify user if someone accessed their record
        if (address && patient.toLowerCase() === address.toLowerCase()) {
          toast(`Your record was accessed by ${accessor.slice(0, 10)}...`, {
            duration: 5000,
            position: 'bottom-right',
            icon: 'ℹ️',
          });
        }
      });
    },
  });
}
