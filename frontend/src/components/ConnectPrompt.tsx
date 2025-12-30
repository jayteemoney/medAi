import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectPrompt() {
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 mb-8">
          Connect your wallet to access your decentralized health records. Your data is encrypted,
          secured on IPFS, and only you have control.
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-gray-500">
          <div>
            <svg
              className="w-8 h-8 mx-auto mb-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="font-semibold">Secure</p>
          </div>
          <div>
            <svg
              className="w-8 h-8 mx-auto mb-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p className="font-semibold">Private</p>
          </div>
          <div>
            <svg
              className="w-8 h-8 mx-auto mb-2 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="font-semibold">Decentralized</p>
          </div>
        </div>
      </div>
    </div>
  );
}
