import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import contractData from '../contracts/HealthRecordRegistry.json';
import type { HealthRecord } from '../types';
import { useRecordAddedEvent, useRecordAccessedEvent } from './useContractEvents';
import toast from 'react-hot-toast';

const CONTRACT_ADDRESS = contractData.address as `0x${string}`;
const CONTRACT_ABI = contractData.abi;

export function useHealthRecords() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Listen to contract events for real-time updates
  useRecordAddedEvent(address);
  useRecordAccessedEvent(address);

  // Read: Get all records for connected user
  const { data: records, isLoading: loadingRecords, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllRecords',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read: Get record count
  const { data: recordCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRecordCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write: Add new record
  const { writeContractAsync, isPending: isAdding } = useWriteContract();

  const addRecord = async (ipfsHash: string, recordType: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addRecord',
        args: [ipfsHash, recordType],
      });

      // Show success message
      toast.success('Transaction submitted! Waiting for confirmation...', {
        duration: 3000,
      });

      // Refetch records after transaction
      await queryClient.invalidateQueries({ queryKey: ['readContract'] });
      await refetch();

      return hash;
    } catch (error: any) {
      // Handle user rejection
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to add record: ' + (error.message || 'Unknown error'));
      }
      throw error;
    }
  };

  return {
    records: (records as HealthRecord[]) || [],
    recordCount: recordCount ? Number(recordCount) : 0,
    loadingRecords,
    isAdding,
    addRecord,
    refetch,
  };
}
