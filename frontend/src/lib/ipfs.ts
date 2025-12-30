const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

function validatePinataConfig() {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API keys not configured. Please add VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY to your .env file');
  }
}

export async function uploadToIPFS(file: File): Promise<string> {
  validatePinataConfig();

  try {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: `medblocai-${Date.now()}-${file.name}`,
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch(PINATA_API_URL, {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY!,
        'pinata_secret_api_key': PINATA_SECRET_KEY!,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export async function uploadJSONToIPFS(data: object): Promise<string> {
  validatePinataConfig();

  try {
    const response = await fetch(PINATA_JSON_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY!,
        'pinata_secret_api_key': PINATA_SECRET_KEY!,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `medblocai-record-${Date.now()}.json`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata JSON upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error('Failed to upload data to IPFS');
  }
}

export function getIPFSUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
