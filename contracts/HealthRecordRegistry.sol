// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HealthRecordRegistry
 * @author MedBlocAI Team
 * @notice Decentralized health record registry using IPFS for storage
 * @dev Store health record IPFS hashes on-chain for patient data integrity and sovereignty
 * @custom:security-contact security@medblocai.com
 */
contract HealthRecordRegistry {

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error EmptyIPFSHash();
    error EmptyRecordType();
    error InvalidIPFSHashLength();
    error RecordIndexOutOfBounds(uint256 requested, uint256 available);
    error NoRecordsFound(address patient);

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event RecordAdded(
        address indexed patient,
        string indexed ipfsHash,
        string recordType,
        uint256 timestamp,
        uint256 indexed recordIndex
    );

    event RecordAccessed(
        address indexed patient,
        address indexed accessor,
        uint256 indexed recordIndex,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Structure to store health record metadata
    struct HealthRecord {
        string ipfsHash;        // IPFS content identifier (CID) - typically 46-59 characters
        uint256 timestamp;      // Block timestamp when record was added
        address patient;        // Patient's wallet address (owner)
        string recordType;      // Type: "consultation", "lab_result", "prescription", "imaging", etc.
    }

    /// @dev Mapping from patient address to their array of health records
    mapping(address => HealthRecord[]) private patientRecords;

    /// @dev Counter for total records across all patients
    uint256 private _totalRecords;

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Add a new health record for the caller (patient)
     * @dev Records are immutable once added. IPFS hash should point to encrypted medical data
     * @param _ipfsHash The IPFS CID of the encrypted health record (e.g., "QmXxx..." or "bafxxx...")
     * @param _recordType The category of health record being stored
     *
     * Requirements:
     * - IPFS hash must not be empty
     * - IPFS hash should be between 46-59 characters (CIDv0/CIDv1 standard)
     * - Record type must not be empty
     *
     * Emits a {RecordAdded} event
     */
    function addRecord(string calldata _ipfsHash, string calldata _recordType) external {
        // Input validation
        if (bytes(_ipfsHash).length == 0) revert EmptyIPFSHash();
        if (bytes(_recordType).length == 0) revert EmptyRecordType();

        // Validate IPFS hash length (CIDv0: 46 chars, CIDv1: 46-59 chars typically)
        uint256 hashLength = bytes(_ipfsHash).length;
        if (hashLength < 46 || hashLength > 100) revert InvalidIPFSHashLength();

        // Store record
        HealthRecord memory newRecord = HealthRecord({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            patient: msg.sender,
            recordType: _recordType
        });

        patientRecords[msg.sender].push(newRecord);

        uint256 recordIndex;
        unchecked {
            _totalRecords++; // Safe: won't realistically overflow
            recordIndex = patientRecords[msg.sender].length - 1;
        }

        emit RecordAdded(
            msg.sender,
            _ipfsHash,
            _recordType,
            block.timestamp,
            recordIndex
        );
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get the total number of records for a specific patient
     * @param _patient The address of the patient to query
     * @return count The number of health records for the patient
     */
    function getRecordCount(address _patient) external view returns (uint256 count) {
        return patientRecords[_patient].length;
    }

    /**
     * @notice Get a specific health record for a patient
     * @dev Anyone can view records (public health transparency model). For private records, encrypt data off-chain
     * @param _patient The address of the patient
     * @param _index The index of the record in the patient's record array (0-based)
     * @return record The health record at the specified index
     */
    function getRecord(address _patient, uint256 _index)
        external
        view
        returns (HealthRecord memory record)
    {
        uint256 recordCount = patientRecords[_patient].length;
        if (_index >= recordCount) {
            revert RecordIndexOutOfBounds(_index, recordCount);
        }
        return patientRecords[_patient][_index];
    }

    /**
     * @notice Get all health records for a specific patient
     * @dev Warning: Gas-intensive for patients with many records. Consider pagination in production
     * @param _patient The address of the patient
     * @return records Array of all health records for the patient
     */
    function getAllRecords(address _patient)
        external
        view
        returns (HealthRecord[] memory records)
    {
        return patientRecords[_patient];
    }

    /**
     * @notice Get the most recent health record for the caller
     * @dev Convenience function for patients to quickly access their latest record
     * @return record The most recent health record for msg.sender
     */
    function getMyLatestRecord() external view returns (HealthRecord memory record) {
        uint256 recordCount = patientRecords[msg.sender].length;
        if (recordCount == 0) {
            revert NoRecordsFound(msg.sender);
        }

        unchecked {
            uint256 lastIndex = recordCount - 1; // Safe: checked recordCount > 0
            return patientRecords[msg.sender][lastIndex];
        }
    }

    /**
     * @notice Check if a patient has any records stored
     * @param _patient The address of the patient to check
     * @return hasAnyRecords True if the patient has at least one record, false otherwise
     */
    function hasRecords(address _patient) external view returns (bool hasAnyRecords) {
        return patientRecords[_patient].length > 0;
    }

    /**
     * @notice Get the total number of records across all patients
     * @return total The cumulative count of all health records in the registry
     */
    function totalRecords() external view returns (uint256 total) {
        return _totalRecords;
    }

    /**
     * @notice Get a paginated slice of records for a patient
     * @dev Useful for frontend pagination to avoid gas limits on large record sets
     * @param _patient The address of the patient
     * @param _offset The starting index (0-based)
     * @param _limit Maximum number of records to return
     * @return records Array of health records within the specified range
     * @return total Total number of records for this patient
     */
    function getRecordsPaginated(
        address _patient,
        uint256 _offset,
        uint256 _limit
    ) external view returns (HealthRecord[] memory records, uint256 total) {
        total = patientRecords[_patient].length;

        if (_offset >= total) {
            return (new HealthRecord[](0), total);
        }

        uint256 end = _offset + _limit;
        if (end > total) {
            end = total;
        }

        uint256 resultLength;
        unchecked {
            resultLength = end - _offset;
        }

        records = new HealthRecord[](resultLength);

        for (uint256 i = 0; i < resultLength;) {
            unchecked {
                records[i] = patientRecords[_patient][_offset + i];
                ++i;
            }
        }

        return (records, total);
    }
}
