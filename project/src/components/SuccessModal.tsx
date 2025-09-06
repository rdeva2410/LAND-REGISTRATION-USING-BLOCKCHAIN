import React from 'react';
import { CheckCircle, X, Download, Hash, Calendar } from 'lucide-react';
import { LandRecord } from '../types';
import { PDFGenerator } from '../utils/pdfGenerator';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LandRecord;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    try {
      await PDFGenerator.generateCertificate(record);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to generate PDF certificate. Please try again.');
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

  const generateQRContent = () => {
    return `LANDCHAIN_VERIFY:${record.registrationNumber}:${record.ownerNIC}:${record.transactionHash}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
              <p className="text-gray-600">Your property has been registered on the blockchain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Certificate */}
          <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 p-6 rounded-xl border border-blue-500/30">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-100 mb-2">Digital Land Certificate</h3>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {record.registrationNumber}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Property Owner</label>
                  <p className="text-lg font-semibold text-gray-100">{record.ownerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Aadhaar Number</label>
                  <p className="font-semibold text-gray-100">{record.ownerNIC}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Land Size</label>
                  <p className="font-semibold text-gray-100">{record.landSize} acres</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Property Type</label>
                  <p className="font-semibold text-gray-100">{record.landType}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Location</label>
                  <p className="font-semibold text-gray-100">{record.district}, {record.province}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Registration Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-100">{formatDate(record.registrationDate)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-green-400">Verified on Blockchain</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <label className="text-sm font-medium text-gray-400">Property Address</label>
              <p className="text-gray-100 mt-1">{record.propertyAddress}</p>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Hash className="h-5 w-5 mr-2" />
              Blockchain Transaction Details
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Transaction Hash</label>
                <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {record.transactionHash}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Block Hash</label>
                <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {record.blockHash}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Previous Block Hash</label>
                <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {record.previousHash}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-blue-900/30 p-6 rounded-xl text-center border border-blue-500/30">
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Verification QR Code</h4>
            <div className="bg-gray-800/50 p-4 rounded-lg inline-block border border-gray-600">
              <div className="w-32 h-32 bg-gray-700/50 flex items-center justify-center rounded">
                <span className="text-xs text-gray-400 text-center">QR Code<br/>Placeholder</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Use this QR code for quick verification of your land registration
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download Certificate</span>
            </button>
            <button 
              onClick={onClose}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};