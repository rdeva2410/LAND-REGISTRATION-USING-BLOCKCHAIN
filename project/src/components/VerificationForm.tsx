import React, { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, Clock, Hash } from 'lucide-react';
import { BlockchainService } from '../utils/blockchain';
import { LandRecord } from '../types';

export const VerificationForm: React.FC = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [ownerNIC, setOwnerNIC] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    record?: LandRecord;
    message: string;
  } | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationNumber.trim() || !ownerNIC.trim()) {
      setVerificationResult({
        isValid: false,
        message: 'Please provide both registration number and Aadhaar number'
      });
      return;
    }

    // Validate Aadhaar format
    if (!/^\d{12}$/.test(ownerNIC.trim())) {
      setVerificationResult({
        isValid: false,
        message: 'Aadhaar number must be exactly 12 digits'
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate blockchain verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = BlockchainService.verifyRecord(registrationNumber.trim(), ownerNIC.trim());
      
      if (result.isValid && result.record) {
        setVerificationResult({
          isValid: true,
          record: result.record,
          message: 'Land registration verified successfully on the blockchain'
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: 'No matching land registration found or verification failed'
        });
      }
    } catch (error) {
      setVerificationResult({
        isValid: false,
        message: 'Verification failed due to system error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Verification Form */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg glow-blue">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Verify Land Registration
            </h2>
            <p className="text-gray-400">Check the authenticity of land records on the blockchain</p>
          </div>
        </div>

        <form onSubmit={handleVerification} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="e.g., WE-12345678-ABC"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Owner Aadhaar Number
              </label>
              <input
                type="text"
                value={ownerNIC}
                onChange={(e) => setOwnerNIC(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="123456789012 (12 digits)"
                maxLength={12}
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isVerifying}
              className={`flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 transform ${
                isVerifying 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>{isVerifying ? 'Verifying...' : 'Verify Registration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Verification Results */}
      {verificationResult && (
        <div className={`bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-8 border-l-4 border border-gray-700/50 ${
          verificationResult.isValid ? 'border-l-green-500 glow-green' : 'border-l-red-500'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            {verificationResult.isValid ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                verificationResult.isValid ? 'text-green-400' : 'text-red-400'
              }`}>
                {verificationResult.isValid ? 'Verification Successful' : 'Verification Failed'}
              </h3>
              <p className={`${verificationResult.isValid ? 'text-green-300' : 'text-red-300'}`}>
                {verificationResult.message}
              </p>
            </div>
          </div>

          {verificationResult.isValid && verificationResult.record && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Owner:</span>
                    <span className="font-semibold">{verificationResult.record.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NIC:</span>
                    <span className="font-semibold">{verificationResult.record.ownerNIC}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Land Size:</span>
                    <span className="font-semibold">{verificationResult.record.landSize} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{verificationResult.record.landType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">District:</span>
                    <span className="font-semibold">{verificationResult.record.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Province:</span>
                    <span className="font-semibold">{verificationResult.record.province}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-semibold text-gray-900 mb-2">Address:</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {verificationResult.record.propertyAddress}
                  </p>
                </div>
              </div>

              {/* Blockchain Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Hash className="h-4 w-4 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <span className="text-gray-600 text-sm">Transaction Hash:</span>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                        {verificationResult.record.transactionHash}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Hash className="h-4 w-4 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <span className="text-gray-600 text-sm">Block Hash:</span>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                        {verificationResult.record.blockHash}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-gray-600 text-sm">Registered:</span>
                      <p className="font-semibold text-sm">
                        {formatDate(verificationResult.record.registrationDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <span className="text-gray-600 text-sm">Last Verified:</span>
                      <p className="font-semibold text-sm">
                        {formatDate(verificationResult.record.lastVerified)}
                      </p>
                    </div>
                  </div>
                </div>

                {verificationResult.record.coordinates && (
                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-900 mb-2">GPS Coordinates:</h5>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Lat: {verificationResult.record.coordinates.latitude}°, 
                        Lng: {verificationResult.record.coordinates.longitude}°
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};