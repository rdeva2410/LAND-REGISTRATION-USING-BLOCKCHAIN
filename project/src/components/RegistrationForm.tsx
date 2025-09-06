import React, { useState } from 'react';
import { MapPin, FileText, User, Home, Calendar, Save } from 'lucide-react';
import { LandRecord } from '../types';
import { BlockchainService } from '../utils/blockchain';

interface RegistrationFormProps {
  onRegistrationComplete: (record: LandRecord) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerNIC: '',
    propertyAddress: '',
    district: '',
    province: '',
    landSize: '',
    landType: '',
    latitude: '',
    longitude: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const provinces = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];
  const landTypes = ['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Recreational'];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerNIC.trim()) newErrors.ownerNIC = 'NIC number is required';
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.province) newErrors.province = 'Province selection is required';
    if (!formData.landSize || parseFloat(formData.landSize) <= 0) newErrors.landSize = 'Valid land size is required';
    if (!formData.landType) newErrors.landType = 'Land type selection is required';

    if (formData.ownerNIC && !/^\d{12}$/.test(formData.ownerNIC)) {
      newErrors.ownerNIC = 'Aadhaar number must be exactly 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateRegistrationNumber = (): string => {
    const prefix = formData.province.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate blockchain processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const landRecord: Omit<LandRecord, 'blockHash' | 'previousHash' | 'transactionHash'> = {
        id: crypto.randomUUID(),
        registrationNumber: generateRegistrationNumber(),
        ownerName: formData.ownerName.trim(),
        ownerNIC: formData.ownerNIC.trim(),
        propertyAddress: formData.propertyAddress.trim(),
        district: formData.district.trim(),
        province: formData.province,
        landSize: parseFloat(formData.landSize),
        landType: formData.landType,
        registrationDate: new Date(),
        lastVerified: new Date(),
        isVerified: true,
        documents: [],
        coordinates: formData.latitude && formData.longitude ? {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        } : undefined
      };

      const blockchainRecord = BlockchainService.createTransaction(landRecord);
      BlockchainService.saveRecord(blockchainRecord);
      
      onRegistrationComplete(blockchainRecord);
      
      // Reset form
      setFormData({
        ownerName: '',
        ownerNIC: '',
        propertyAddress: '',
        district: '',
        province: '',
        landSize: '',
        landType: '',
        latitude: '',
        longitude: ''
      });

    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 text-black">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-green-100 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Land Registration</h2>
            <p className="text-gray-600">Register your property on the blockchain</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.ownerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter owner's full name"
                />
                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number *
                </label>
                <input
                  type="text"
                  value={formData.ownerNIC}
                  onChange={(e) => handleInputChange('ownerNIC', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.ownerNIC ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123456789012 (12 digits)"
                  maxLength={12}
                />
                {errors.ownerNIC && <p className="text-red-500 text-sm mt-1">{errors.ownerNIC}</p>}
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Property Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address *
                </label>
                <textarea
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.propertyAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete property address"
                />
                {errors.propertyAddress && <p className="text-red-500 text-sm mt-1">{errors.propertyAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    } text-gray-900 placeholder-gray-400 bg-white`}
                    placeholder="e.g., Colombo"
                  />
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.province ? 'border-red-500' : 'border-gray-300'
                    } text-gray-900 placeholder-gray-400 bg-white`}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Land Type *
                  </label>
                  <select
                    value={formData.landType}
                    onChange={(e) => handleInputChange('landType', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.landType ? 'border-red-500' : 'border-gray-300'
                    } text-gray-900 placeholder-gray-400 bg-white`}
                  >
                    <option value="">Select Type</option>
                    {landTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.landType && <p className="text-red-500 text-sm mt-1">{errors.landType}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Land Size (acres) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.landSize}
                  onChange={(e) => handleInputChange('landSize', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.landSize ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 placeholder-gray-400 bg-white`}
                  placeholder="e.g., 2.5"
                />
                {errors.landSize && <p className="text-red-500 text-sm mt-1">{errors.landSize}</p>}
              </div>
            </div>
          </div>

          {/* Location Coordinates (Optional) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              GPS Coordinates (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                  placeholder="e.g., 6.9271"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                  placeholder="e.g., 79.8612"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 transform ${
                isSubmitting 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl glow-blue animate-pulse-glow'
              }`}
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting ? 'Registering on Blockchain...' : 'Register Property'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};