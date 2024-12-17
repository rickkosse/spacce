# spacce🚴‍♂️ 

An interactive React and Python application for simulating and monitoring training metrics such as **power**, **heart rate**, **cadence**, **speed**, and **total time**. The project includes Bluetooth device selection, real-time graph visualization, and a backend powered by FastAPI.

![Demo Screenshot](demo-image-placeholder.png)

## 🎯 Features

- **Simulated training data** (power, heart rate, cadence, speed)
- **Real-time graphs** to visualize power output over time
- **Bluetooth device selection**: Choose trainer, heart rate monitor, cadence sensor, speed sensor, and power meter
- **Time display in minutes**
- **Responsive design** for desktop and mobile
- **Python backend** with FastAPI for managing data

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
cycling-training-dashboard/
├── backend/                  # FastAPI backend
│   ├── main.py               # Main FastAPI app
├── public/                   # Public files
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

## 🚀 Installation and Setup

Follow these steps to run the project locally:

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

### Backend
1. **Navigate to the backend folder**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server**
   ```bash
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

## 🎨 Screenshot

![Training Dashboard Screenshot](screenshot-placeholder.png)

---

**Author:** Rick Kosse  
