import React, { useEffect, useReducer } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrainingDashboard.css';

// Helper functions
const generateSimulatedValue = (min, max, previousValue = null) => {
  if (previousValue === null) {
    return Math.random() * (max - min) + min;
  }
  const noise = (Math.random() - 0.5) * 0.1 * (max - min);
  const newValue = previousValue + noise;
  return Math.min(Math.max(newValue, min), max);
};

// State management
const initialState = {
  power: 0,
  simulatedPower: 0,
  heartRate: 0,
  cadence: 0,
  speed: 0,
  totalTime: 0,
  powerHistory: [],
  simulatedPowerHistory: [],
  isSimulated: true,
  previousValues: {
    power: null,
    heartRate: null,
    cadence: null,
    speed: null
  }
};

function trainingReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REAL_DATA':
      const newPowerHistory = [
        ...state.powerHistory,
        { time: state.totalTime / 60, power: action.payload.power }
      ].slice(-50);

      return {
        ...state,
        ...action.payload,
        totalTime: state.totalTime + 1,
        powerHistory: newPowerHistory
      };

    case 'UPDATE_SIMULATED_DATA':
      const newSimulatedHistory = [
        ...state.simulatedPowerHistory,
        { time: state.totalTime / 60, simulatedPower: action.payload.power }
      ].slice(-50);

      return {
        ...state,
        simulatedPower: action.payload.power,
        simulatedPowerHistory: newSimulatedHistory
      };

    case 'TOGGLE_SIMULATION':
      return {
        ...state,
        isSimulated: !state.isSimulated
      };

    default:
      return state;
  }
}

const CyclingTrainingDashboard = () => {
  const [state, dispatch] = useReducer(trainingReducer, initialState);

  useEffect(() => {
    let previousValues = state.previousValues;

    const intervalId = setInterval(() => {
      const newValues = {
        power: Math.round(generateSimulatedValue(100, 300, previousValues.power)),
        heartRate: Math.round(generateSimulatedValue(60, 180, previousValues.heartRate)),
        cadence: Math.round(generateSimulatedValue(50, 120, previousValues.cadence)),
        speed: Number(generateSimulatedValue(20, 40, previousValues.speed).toFixed(1))
      };

      previousValues = newValues;

      dispatch({
        type: 'UPDATE_SIMULATED_DATA',
        payload: newValues
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-title">Real Power</div>
          <div className="metric-value">{state.power} W</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Simulated Power</div>
          <div className="metric-value">{state.simulatedPower} W</div>
        </div>
        {/* ... other metrics ... */}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 'auto']} />
            <Tooltip />
            <Legend />
            <Line 
              data={state.powerHistory}
              type="monotone" 
              dataKey="power" 
              stroke="#8884d8" 
              name="Real Power"
              dot={false} 
            />
            <Line 
              data={state.simulatedPowerHistory}
              type="monotone" 
              dataKey="simulatedPower" 
              stroke="#82ca9d" 
              name="Simulated Power"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CyclingTrainingDashboard;
