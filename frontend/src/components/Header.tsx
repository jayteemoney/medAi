import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { LayoutDashboard, FileText, Plus } from 'lucide-react';

export function Header() {
  const { isConnected } = useAccount();
  const location = useLocation();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/records', label: 'Records', icon: FileText },
    { to: '/add-record', label: 'Add Record', icon: Plus },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MedBlocAI
              </h1>
              <p className="text-xs text-gray-600 font-medium">Your Health, Your Control</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isConnected && (
              <nav className="hidden md:flex items-center gap-2 mr-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                        ${isActive
                          ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
