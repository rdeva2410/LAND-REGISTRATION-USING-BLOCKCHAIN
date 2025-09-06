import React, { useState, useEffect } from 'react';
import { BarChart3, MapPin, Calendar, Hash, Search, Filter } from 'lucide-react';
import { BlockchainService } from '../utils/blockchain';
import { LandRecord } from '../types';

export const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<LandRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedLandType, setSelectedLandType] = useState('');

  useEffect(() => {
    const allRecords = BlockchainService.getAllRecords();
    setRecords(allRecords);
    setFilteredRecords(allRecords);
  }, []);

  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter(record => record.province === selectedProvince);
    }

    if (selectedLandType) {
      filtered = filtered.filter(record => record.landType === selectedLandType);
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, selectedProvince, selectedLandType]);

  const getStats = () => {
    const totalRecords = records.length;
    const totalLandSize = records.reduce((sum, record) => sum + record.landSize, 0);
    const provinces = [...new Set(records.map(record => record.province))];
    const landTypes = records.reduce((acc, record) => {
      acc[record.landType] = (acc[record.landType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRecords,
      totalLandSize: totalLandSize.toFixed(2),
      provinces: provinces.length,
      landTypes
    };
  };

  const stats = getStats();
  const provinces = [...new Set(records.map(record => record.province))];
  const landTypes = [...new Set(records.map(record => record.landType))];

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-100">{stats.totalRecords}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg glow-blue">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Land (acres)</p>
              <p className="text-3xl font-bold text-gray-100">{stats.totalLandSize}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg glow-green">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Provinces</p>
              <p className="text-3xl font-bold text-gray-100">{stats.provinces}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-100">
                {records.filter(r => {
                  const date = new Date(r.registrationDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, registration number, address, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedLandType}
              onChange={(e) => setSelectedLandType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {landTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-100">
            Land Registry Records ({filteredRecords.length})
          </h3>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-lg">No records found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Registration Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Blockchain
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-100">
                          {record.registrationNumber}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDate(record.registrationDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-100">
                          {record.ownerName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {record.ownerNIC}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-100">
                        <span className="font-medium">{record.landSize} acres</span> - {record.landType}
                      </div>
                      <div className="text-sm text-gray-400 max-w-xs truncate">
                        {record.propertyAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-100">
                          {record.district}
                        </div>
                        <div className="text-sm text-gray-400">
                          {record.province}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-mono text-gray-300">
                          {record.blockHash.substring(0, 8)}...
                        </span>
                      </div>
                      <div className="text-xs text-green-400 mt-1">
                        ✓ Verified
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};