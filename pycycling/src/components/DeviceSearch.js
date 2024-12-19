import React, { useState, useCallback } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip 
} from '@mui/material';
import Button from '@mui/material/Button';
import { PlayArrow } from '@mui/icons-material';
import { BluetoothConnected, BluetoothSearching } from 'lucide-react';

const DeviceTypes = {
  TRAINER: 'trainer',
  HEART_RATE: 'heartRate',
  CADENCE: 'cadence',
  SPEED: 'speed',
  POWER: 'power'
};

const MOCK_DEVICES = [
  {
    name: "Wahoo KICKR",
    address: "00:11:22:33:44:55",
    type: DeviceTypes.TRAINER
  },
  {
    name: "Polar H10",
    address: "AA:BB:CC:DD:EE:FF",
    type: DeviceTypes.HEART_RATE
  },
  {
    name: "Garmin Cadence",
    address: "11:22:33:44:55:66",
    type: DeviceTypes.CADENCE
  },
  {
    name: "Garmin meter",
    address: "11:22:33:44:55:66",
    type: DeviceTypes.SPEED
  },
  {
    name: "Test Power Meter",
    address: "BB:CC:DD:EE:FF:00",
    type: DeviceTypes.POWER
  }
];

const DeviceSearch = ({ onDeviceSelect, onStartTraining, testMode = true }) => {

  const [bluetoothDevices, setBluetoothDevices] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState({
    [DeviceTypes.TRAINER]: null,
    [DeviceTypes.HEART_RATE]: null,
    [DeviceTypes.CADENCE]: null,
    [DeviceTypes.SPEED]: null,
    [DeviceTypes.POWER]: null,
  });

  
  const searchBluetoothDevices = useCallback(async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      if (testMode) {
        console.log('Test mode active - loading mock devices');
        setBluetoothDevices(MOCK_DEVICES);
        return;
      }

      const response = await fetch('http://localhost:8000/devices');
      const devices = await response.json();
      
      if (devices.length === 0) {
        console.log('No devices found, falling back to mock devices');
        setBluetoothDevices(MOCK_DEVICES);
      } else {
        setBluetoothDevices(devices);
      }
    } catch (error) {
      console.error('Device search error:', error);
      setError('Failed to search for devices');
      if (testMode) {
        console.log('Error occurred, falling back to mock devices');
        setBluetoothDevices(MOCK_DEVICES);
      }
    } finally {
      setIsSearching(false);
    }
  }, [testMode]);

  const selectDevice = useCallback(async (device) => {
    try {
      await fetch(`http://localhost:8000/connect/${device.address}`);
      setSelectedDevices((prev) => ({
        ...prev,
        [device.type]: device,
      }));
      onDeviceSelect(device);
    } catch (error) {
      setError(`Failed to connect to ${device.name}`);
      console.error('Device connection error:', error);
    }
  }, [onDeviceSelect]);

  const renderDeviceCard = useCallback((device, type) => (
    <Card
      key={device.address}
      className={`device-card ${
        selectedDevices[type]?.address === device.address ? 'selected' : ''
      }`}
      onClick={() => selectDevice(device)}
    >
      <CardHeader
        avatar={
          <BluetoothConnected 
            className={selectedDevices[type]?.address === device.address ? 'text-blue-500' : 'text-gray-400'} 
          />
        }
        title={
          <Typography variant="h6">
            {device.name || 'Unknown Device'}
          </Typography>
        }
        subheader={device.address}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {type.charAt(0).toUpperCase() + type.slice(1)} Device
        </Typography>
      </CardContent>
    </Card>
  ), [selectedDevices, selectDevice]);

  return (
    <div className="device-search">
      <Box className="search-header" mb={2}>
        <Button
          variant="contained"
          startIcon={isSearching ? <CircularProgress size={20} /> : <BluetoothSearching />}
          onClick={searchBluetoothDevices}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search Devices'}
        </Button>
        
        {/* Add Start Training button */}
        <Button
          variant="contained"
          color="success"
          disabled={!selectedDevices[DeviceTypes.TRAINER]}
          onClick={onStartTraining}
          startIcon={<PlayArrow />}
        >
          Start Training
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="device-grid">
        {Object.values(DeviceTypes).map((type) => (
          <div key={type} className="device-type-section">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {type.charAt(0).toUpperCase() + type.slice(1)} Devices
              </Typography>
              {/* Show connection status */}
              {selectedDevices[type] && (
                <Chip 
                  label="Connected" 
                  color="success" 
                  size="small"
                  icon={<BluetoothConnected />} 
                />
              )}
            </Box>
            
            {/* Show devices or empty state */}
            {bluetoothDevices.filter(device => device.type === type).length > 0 ? (
              bluetoothDevices
                .filter(device => device.type === type)
                .map(device => renderDeviceCard(device, type))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No {type} devices found
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceSearch;