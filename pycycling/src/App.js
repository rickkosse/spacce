import React, { useState } from 'react';
import DeviceSearch from './components/DeviceSearch';
import TrainingDashboard from './components/TrainingDashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('device-search');
  const [trainingData, setTrainingData] = useState({
    power: 0,
    heartRate: 0,
    totalTime: 0,
  });

  const handleDeviceSelect = (device) => {
    console.log('Device selected:', device);
  };

  const handleStartTraining = () => {
    setCurrentPage('training-dashboard');
  };

  return (
    <div className="container mx-auto">
      {currentPage === 'device-search' && (
        <DeviceSearch
          onDeviceSelect={handleDeviceSelect}
          onStartTraining={handleStartTraining}
        />
      )}
      {currentPage === 'training-dashboard' && (
        <TrainingDashboard trainingData={trainingData} />
      )}
    </div>
  );
};

export default App;
