# Spacce 🚴‍♂️ 

A React and FastAPI application for indoor cycling that connects with Bluetooth devices to monitor real-time training metrics. Features both real device data and simulation capabilities.


## ✨ Features

- **Bluetooth Device Integration**
  - Smart Trainers (ANT+/BLE)
  - Heart Rate Monitors
  - Cadence & Speed Sensors
  - Power Meters
  
- **Real-time Metrics**
  - Power output tracking
  - Heart rate monitoring
  - Cadence and speed data
  - Time-based data graphs
  
- **Simulation Mode**
  - Test without physical devices
  - Compare real vs simulated data
  - Realistic data generation
  
- **User Interface**
  - Clean, modern design
  - Real-time data visualization
  - Device connection management
  - Mobile responsive layout

## 🛠️ Technologies

This project is built with:

### Frontend
- **React**: For building the user interface
- **Recharts**: For interactive charts
- **Material-UI**: For elegant components and cards
- **React Hooks**: For state management (`useReducer` and `useEffect`)
- **CSS**: For simple styling and layout

### Backend
- **FastAPI**: For building a Python backend
- **Uvicorn**: ASGI server to run the FastAPI app

## 📂 Project Structure

```
pypedal/
├── main.py                  # # Main FastAPI app
├── src/
│   ├── components/
│   │   ├── DeviceSearch.js   # Component for device selection
│   │   ├── TrainingDashboard.js # Dashboard with real-time data and charts
│   ├── App.js                # Main React application
│   ├── index.js              # Entry point for React
│   ├── styles/
│   │   ├── TrainingDashboard.css # Styling for the dashboard
│   │   ├── DeviceSearch.css  # Styling for device selection
├── package.json              # Project dependencies
├── README.md                 # Documentation (this file)
└── backend/requirements.txt  # Python dependencies
```

## 🛠️ Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm/yarn
- Bluetooth-enabled device

### Frontend
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cycling-training-dashboard.git
   cd cycling-training-dashboard
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Start the React application**
   ```bash
   npm start
   ```

4. **View the app**
   Open your browser and go to: [http://localhost:3000](http://localhost:3000)

### Backend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/spacce.git
cd spacce

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
```

4. **View the API**
   Open your browser and go to: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   
   For API documentation, visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## 🎮 Usage

1. Click **"Search Devices"** to simulate Bluetooth devices.
2. Select your **trainer**, **heart rate monitor**, or other sensors.
3. Press **"Start Training"**.
4. View real-time metrics such as power, heart rate, cadence, and speed.
5. Monitor your progress with a real-time power graph.

## 🧩 Future Improvements

- **Bluetooth Integration**: Connect to real devices
- **Session Storage**: Save and load training sessions
- **Statistics**: Average and maximum values
- **Data Export**: Export sessions to CSV/JSON
- **Authentication**: Add user profiles

## 👥 Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository
2. Create a new feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for more details.

---

**Author:** Rick Kosse
