# EquiTrack - Equity Position Tracking Application

A full-stack web application for maintaining equity positions based on trading transactions. The application processes INSERT, UPDATE, and CANCEL transactions and calculates real-time positions for different securities.

## 🚀 Features

### Core Functionality

- **Transaction Processing**: Handle INSERT, UPDATE, and CANCEL transactions
- **Position Calculation**: Real-time position tracking for multiple securities
- **Trade Management**: Track trade versions and status
- **Responsive UI**: Modern, mobile-friendly interface

### Business Rules Implementation

- ✅ INSERT transactions create new trades (version 1)
- ✅ UPDATE transactions modify existing trades (higher versions)
- ✅ CANCEL transactions mark trades as cancelled
- ✅ Positions update after each transaction
- ✅ Support for out-of-order transaction processing
- ✅ Buy/Sell side tracking with proper position calculation

### Technical Features

- **Frontend**: React with TypeScript and Material-UI
- **Backend**: Java Spring Boot with enterprise-grade features
- **Real-time Updates**: Immediate position recalculation
- **Data Validation**: Comprehensive input validation with Bean validation
- **Error Handling**: Robust error handling and user feedback
- **Enterprise Features**: Spring Boot Actuator, health checks, monitoring

## 📊 Sample Data

The application comes pre-loaded with sample transactions that demonstrate the business logic:

| TransactionID | TradeID | Version | SecurityCode | Quantity | Action | Side |
| ------------- | ------- | ------- | ------------ | -------- | ------ | ---- |
| 1             | 1       | 1       | REL          | 50       | INSERT | Buy  |
| 2             | 2       | 1       | ITC          | 40       | INSERT | Sell |
| 3             | 3       | 1       | INF          | 70       | INSERT | Buy  |
| 4             | 1       | 2       | REL          | 60       | UPDATE | Buy  |
| 5             | 2       | 2       | ITC          | 30       | CANCEL | Buy  |
| 6             | 4       | 1       | INF          | 20       | INSERT | Sell |

**Expected Final Positions:**

- REL: +60 (Updated from 50 to 60)
- ITC: 0 (Cancelled trade)
- INF: +50 (70 Buy - 20 Sell)

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher) - for React frontend
- Java 17 or higher - for Spring Boot backend
- Maven 3.6 or higher - for Java backend
- npm or yarn - for frontend

### Quick Start

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd EquiTrack
   npm run install-all
   ```

2. **Setup Java Backend**

   ```bash
   npm run setup-java
   ```

3. **Start the Application**

   ```bash
   npm run dev
   ```

   This will start both:

   - Spring Boot backend on `http://localhost:3001`
   - React frontend on `http://localhost:3000`

### Manual Setup

#### Backend Setup (Spring Boot)

```bash
cd backend
./setup.sh  # Install Maven if needed and build project
mvn spring-boot:run
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🏗️ Project Structure

```
EquiTrack/
├── backend/                # Java Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/equitrack/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── model/         # Data models
│   │   │   │   ├── service/       # Business logic
│   │   │   │   └── EquiTrackApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/           # Unit tests
│   ├── pom.xml
│   ├── setup.sh            # Setup script
│   ├── Dockerfile          # Docker support
│   └── README.md
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── PositionCard.tsx
│   │   │   ├── PositionsDashboard.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TradesTable.tsx
│   │   ├── services/       # API services
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx         # Main application
│   │   └── index.tsx       # Entry point
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── package.json            # Root package.json
├── README.md               # Main documentation
└── JAVA_BACKEND_SUMMARY.md # Java backend details
```

## 🎯 Usage

### 1. View Positions Dashboard

- Navigate to the "Positions Dashboard" tab
- View current positions with visual indicators
- See summary statistics and exposure metrics

### 2. Add Transactions

- Go to the "Add Transaction" tab
- Fill in the transaction details:
  - **Trade ID**: Unique identifier for the trade
  - **Version**: Version number (1 for INSERT, higher for UPDATE/CANCEL)
  - **Security Code**: Security identifier (e.g., REL, ITC, INF)
  - **Quantity**: Number of shares
  - **Action**: INSERT, UPDATE, or CANCEL
  - **Side**: Buy or Sell
- Click "Add Transaction" to process

### 3. View Trades

- Navigate to the "Trades" tab
- See all trades with their current status
- View version history and cancellation status

### 4. Data Management

- **Load Sample Data**: Load the predefined sample transactions
- **Reset Data**: Clear all transactions and positions
- **Refresh**: Reload data from the server

## 🔧 API Endpoints

### Spring Boot Backend API (Port 3001)

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| GET    | `/api/positions`         | Get all current positions |
| GET    | `/api/trades`            | Get all trades            |
| POST   | `/api/transactions`      | Add a single transaction  |
| POST   | `/api/transactions/bulk` | Add multiple transactions |
| POST   | `/api/reset`             | Reset all data            |
| POST   | `/api/load-sample`       | Load sample data          |
| GET    | `/api/health`            | Health check              |
| GET    | `/actuator/health`       | Spring Boot health check  |

### Example API Usage

```bash
# Get positions
curl http://localhost:3001/api/positions

# Add transaction
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "tradeId": 5,
    "version": 1,
    "securityCode": "AAPL",
    "quantity": 100,
    "action": "INSERT",
    "side": "Buy"
  }'
```

## 🧪 Testing the Business Logic

### Test Scenario 1: Basic Position Calculation

1. Add transaction: TradeID=1, Version=1, Security=REL, Qty=50, Action=INSERT, Side=Buy
2. Expected position: REL = +50

### Test Scenario 2: Update Transaction

1. Add transaction: TradeID=1, Version=2, Security=REL, Qty=60, Action=UPDATE, Side=Buy
2. Expected position: REL = +60 (updated from +50)

### Test Scenario 3: Cancel Transaction

1. Add transaction: TradeID=1, Version=3, Security=REL, Qty=60, Action=CANCEL, Side=Buy
2. Expected position: REL = 0 (cancelled)

### Test Scenario 4: Mixed Buy/Sell

1. Add transaction: TradeID=1, Version=1, Security=INF, Qty=100, Action=INSERT, Side=Buy
2. Add transaction: TradeID=2, Version=1, Security=INF, Qty=30, Action=INSERT, Side=Sell
3. Expected position: INF = +70 (100 Buy - 30 Sell)

## 🎨 UI Features

### Position Cards

- **Color-coded**: Green for long positions, red for short positions, gray for flat
- **Visual indicators**: Icons showing position direction
- **Hover effects**: Interactive cards with smooth animations

### Dashboard

- **Summary cards**: Total positions, long/short counts, exposure metrics
- **Real-time updates**: Positions update immediately after transactions
- **Responsive design**: Works on desktop, tablet, and mobile

### Transaction Form

- **Validation**: Real-time form validation with error messages
- **Auto-completion**: Smart defaults and suggestions
- **Clear feedback**: Success/error notifications

## 🔒 Error Handling

The application includes comprehensive error handling:

- **Input Validation**: All form inputs are validated
- **API Error Handling**: Network errors and server errors are caught
- **User Feedback**: Clear error messages and success notifications
- **Data Integrity**: Prevents invalid state transitions

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build and run Spring Boot backend
cd ../backend
mvn clean package
java -jar target/equitrack-backend-1.0.0.jar
```

### Docker Deployment

```bash
# Build and run with Docker
cd backend
docker build -t equitrack-backend .
docker run -p 3001:3001 equitrack-backend
```

### Environment Variables

- `PORT`: Backend server port (default: 3001)
- `REACT_APP_API_URL`: Frontend API base URL (default: http://localhost:3001/api)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the documentation above
2. Review the sample data and test scenarios
3. Open an issue in the repository

---

**EquiTrack** - Making equity position tracking simple and intuitive! 📈
