import React, { useState } from 'react';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { VerificationForm } from './components/VerificationForm';
import { Dashboard } from './components/Dashboard';
import { SuccessModal } from './components/SuccessModal';
import { LandRecord } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState<LandRecord | null>(null);

  const handleRegistrationComplete = (record: LandRecord) => {
    setRegisteredRecord(record);
    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setRegisteredRecord(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'register':
        return <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />;
      case 'verify':
        return <VerificationForm />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-6 py-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        {renderActiveTab()}
      </main>

      {registeredRecord && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleModalClose}
          record={registeredRecord}
        />
      )}
    </div>
  );
}

export default App;