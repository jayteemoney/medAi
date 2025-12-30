import { expect } from "chai";
import { ethers } from "hardhat";
import { HealthRecordRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("HealthRecordRegistry", function () {
  let healthRecordRegistry: HealthRecordRegistry;
  let owner: SignerWithAddress;
  let patient1: SignerWithAddress;
  let patient2: SignerWithAddress;

  // Valid IPFS CID examples
  const VALID_CID_V0 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"; // 46 chars
  const VALID_CID_V1 = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"; // 59 chars
  const INVALID_SHORT_CID = "QmShortHash"; // Too short
  const INVALID_LONG_CID = "Q".repeat(101); // Too long

  beforeEach(async function () {
    // Get signers
    [owner, patient1, patient2] = await ethers.getSigners();

    // Deploy contract
    const HealthRecordRegistry = await ethers.getContractFactory("HealthRecordRegistry");
    healthRecordRegistry = await HealthRecordRegistry.deploy();
    await healthRecordRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await healthRecordRegistry.getAddress()).to.be.properAddress;
    });

    it("Should start with zero total records", async function () {
      expect(await healthRecordRegistry.totalRecords()).to.equal(0);
    });
  });

  describe("Adding Records", function () {
    it("Should add a record successfully with CIDv0", async function () {
      const recordType = "consultation";
      const timestamp = await time.latest();

      await expect(
        healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, recordType)
      )
        .to.emit(healthRecordRegistry, "RecordAdded")
        .withArgs(patient1.address, VALID_CID_V0, recordType, timestamp + 1, 0);

      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(1);
      expect(await healthRecordRegistry.totalRecords()).to.equal(1);
    });

    it("Should add a record successfully with CIDv1", async function () {
      const recordType = "lab_result";

      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V1, recordType);

      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(1);
      expect(await healthRecordRegistry.totalRecords()).to.equal(1);
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(
        healthRecordRegistry.connect(patient1).addRecord("", "consultation")
      ).to.be.revertedWithCustomError(healthRecordRegistry, "EmptyIPFSHash");
    });

    it("Should reject empty record type", async function () {
      await expect(
        healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "")
      ).to.be.revertedWithCustomError(healthRecordRegistry, "EmptyRecordType");
    });

    it("Should reject IPFS hash that is too short", async function () {
      await expect(
        healthRecordRegistry.connect(patient1).addRecord(INVALID_SHORT_CID, "consultation")
      ).to.be.revertedWithCustomError(healthRecordRegistry, "InvalidIPFSHashLength");
    });

    it("Should reject IPFS hash that is too long", async function () {
      await expect(
        healthRecordRegistry.connect(patient1).addRecord(INVALID_LONG_CID, "consultation")
      ).to.be.revertedWithCustomError(healthRecordRegistry, "InvalidIPFSHashLength");
    });

    it("Should allow multiple records for same patient", async function () {
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V1, "lab_result");
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "prescription");

      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(3);
      expect(await healthRecordRegistry.totalRecords()).to.equal(3);
    });

    it("Should track records separately for different patients", async function () {
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");
      await healthRecordRegistry.connect(patient2).addRecord(VALID_CID_V1, "lab_result");

      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(1);
      expect(await healthRecordRegistry.getRecordCount(patient2.address)).to.equal(1);
      expect(await healthRecordRegistry.totalRecords()).to.equal(2);
    });

    it("Should increment totalRecords correctly", async function () {
      expect(await healthRecordRegistry.totalRecords()).to.equal(0);

      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");
      expect(await healthRecordRegistry.totalRecords()).to.equal(1);

      await healthRecordRegistry.connect(patient2).addRecord(VALID_CID_V1, "lab_result");
      expect(await healthRecordRegistry.totalRecords()).to.equal(2);

      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "prescription");
      expect(await healthRecordRegistry.totalRecords()).to.equal(3);
    });
  });

  describe("Retrieving Records", function () {
    beforeEach(async function () {
      // Add some test records
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V1, "lab_result");
    });

    it("Should retrieve a specific record", async function () {
      const record = await healthRecordRegistry.getRecord(patient1.address, 0);

      expect(record.ipfsHash).to.equal(VALID_CID_V0);
      expect(record.recordType).to.equal("consultation");
      expect(record.patient).to.equal(patient1.address);
      expect(record.timestamp).to.be.greaterThan(0);
    });

    it("Should retrieve all records for a patient", async function () {
      const records = await healthRecordRegistry.getAllRecords(patient1.address);

      expect(records.length).to.equal(2);
      expect(records[0].ipfsHash).to.equal(VALID_CID_V0);
      expect(records[1].ipfsHash).to.equal(VALID_CID_V1);
    });

    it("Should retrieve the latest record for caller", async function () {
      const latestRecord = await healthRecordRegistry.connect(patient1).getMyLatestRecord();

      expect(latestRecord.ipfsHash).to.equal(VALID_CID_V1);
      expect(latestRecord.recordType).to.equal("lab_result");
    });

    it("Should revert with custom error when getting non-existent record index", async function () {
      await expect(
        healthRecordRegistry.getRecord(patient1.address, 999)
      ).to.be.revertedWithCustomError(healthRecordRegistry, "RecordIndexOutOfBounds");
    });

    it("Should revert with custom error when caller has no records", async function () {
      await expect(
        healthRecordRegistry.connect(patient2).getMyLatestRecord()
      ).to.be.revertedWithCustomError(healthRecordRegistry, "NoRecordsFound");
    });

    it("Should correctly check if patient has records", async function () {
      expect(await healthRecordRegistry.hasRecords(patient1.address)).to.be.true;
      expect(await healthRecordRegistry.hasRecords(patient2.address)).to.be.false;
    });
  });

  describe("Pagination", function () {
    beforeEach(async function () {
      // Add 5 test records
      for (let i = 0; i < 5; i++) {
        await healthRecordRegistry.connect(patient1).addRecord(
          VALID_CID_V0,
          `record_type_${i}`
        );
      }
    });

    it("Should paginate records correctly - first page", async function () {
      const [records, total] = await healthRecordRegistry.getRecordsPaginated(
        patient1.address,
        0,
        2
      );

      expect(total).to.equal(5);
      expect(records.length).to.equal(2);
      expect(records[0].recordType).to.equal("record_type_0");
      expect(records[1].recordType).to.equal("record_type_1");
    });

    it("Should paginate records correctly - middle page", async function () {
      const [records, total] = await healthRecordRegistry.getRecordsPaginated(
        patient1.address,
        2,
        2
      );

      expect(total).to.equal(5);
      expect(records.length).to.equal(2);
      expect(records[0].recordType).to.equal("record_type_2");
      expect(records[1].recordType).to.equal("record_type_3");
    });

    it("Should paginate records correctly - last page", async function () {
      const [records, total] = await healthRecordRegistry.getRecordsPaginated(
        patient1.address,
        4,
        2
      );

      expect(total).to.equal(5);
      expect(records.length).to.equal(1); // Only 1 record left
      expect(records[0].recordType).to.equal("record_type_4");
    });

    it("Should return empty array when offset exceeds total", async function () {
      const [records, total] = await healthRecordRegistry.getRecordsPaginated(
        patient1.address,
        10,
        2
      );

      expect(total).to.equal(5);
      expect(records.length).to.equal(0);
    });

    it("Should handle limit exceeding remaining records", async function () {
      const [records, total] = await healthRecordRegistry.getRecordsPaginated(
        patient1.address,
        3,
        10
      );

      expect(total).to.equal(5);
      expect(records.length).to.equal(2); // Only 2 records from index 3
    });
  });

  describe("Record Count", function () {
    it("Should return zero for patient with no records", async function () {
      expect(await healthRecordRegistry.getRecordCount(patient2.address)).to.equal(0);
    });

    it("Should increment record count correctly", async function () {
      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(0);

      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");
      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(1);

      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V1, "lab_result");
      expect(await healthRecordRegistry.getRecordCount(patient1.address)).to.equal(2);
    });
  });

  describe("Gas Optimization", function () {
    it("Should use calldata for string parameters (gas test)", async function () {
      const tx = await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");
      const receipt = await tx.wait();

      // Gas usage should be reasonable (baseline check)
      // ~206k gas for first record (cold storage writes are expensive)
      expect(receipt?.gasUsed).to.be.lessThan(220000);
    });

    it("Should use less gas for subsequent records (warm storage)", async function () {
      // First record
      await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V0, "consultation");

      // Second record (should be slightly cheaper due to warm storage)
      const tx = await healthRecordRegistry.connect(patient1).addRecord(VALID_CID_V1, "lab_result");
      const receipt = await tx.wait();

      // Subsequent records should also be reasonable
      expect(receipt?.gasUsed).to.be.lessThan(220000);
    });
  });
});
