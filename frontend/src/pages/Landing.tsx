import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Database, Brain, ArrowRight, Check } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function Landing() {
  const { isConnected } = useAccount();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and stored on IPFS. Only you control access.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Blockchain Verified',
      description: 'Immutable records on Base Sepolia blockchain ensure data integrity.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Analysis',
      description: 'Get intelligent insights from your health data with AI-powered analysis.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    'Own your medical data',
    'Access from anywhere',
    'Share with providers securely',
    'Never lose your records',
    'AI-powered insights',
    'HIPAA compliant storage',
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-linear-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >


            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Your Health Records,
              <span className="block bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Secured by Blockchain
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take control of your medical data with decentralized storage, AI analysis, and blockchain verification. Built for Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-8 py-4 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectButton />
                </div>
              )}
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:border-gray-400 transition-colors"
              >
                Learn More
              </a>
            </div>

            <div className="mt-12 flex justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Decentralized</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MedBlocAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The future of healthcare data management is here. Secure, private, and intelligent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"
                     style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                <div className="relative p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all bg-white">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${feature.gradient} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything you need for your health data
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                MedBlocAI provides a comprehensive platform for managing, securing, and analyzing your medical records with blockchain technology.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 p-8 shadow-2xl">
                <div className="w-full h-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <Database className="w-20 h-20 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Your Data, Your Control</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-500 rounded-full opacity-20 blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to take control of your health data?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users securing their medical records on the blockchain.
            </p>
            {!isConnected && (
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
