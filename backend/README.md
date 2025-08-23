# EquiTrack Backend - Java Spring Boot

A Spring Boot backend application for maintaining equity positions based on trading transactions. This application processes INSERT, UPDATE, and CANCEL transactions and calculates real-time positions for different securities.

## 🚀 Features

### Core Functionality

- **Transaction Processing**: Handle INSERT, UPDATE, and CANCEL transactions
- **Position Calculation**: Real-time position tracking for multiple securities
- **Trade Management**: Track trade versions and status
- **RESTful API**: Complete REST API with validation and error handling

### Business Rules Implementation

- ✅ INSERT transactions create new trades (version 1)
- ✅ UPDATE transactions modify existing trades (higher versions)
- ✅ CANCEL transactions mark trades as cancelled
- ✅ Positions update after each transaction
- ✅ Support for out-of-order transaction processing
- ✅ Buy/Sell side tracking with proper position calculation

### Technical Features

- **Spring Boot 3.2.0**: Latest Spring Boot version with Java 17
- **REST API**: Complete RESTful endpoints with proper HTTP status codes
- **Validation**: Bean validation with custom error messages
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: Spring Boot Actuator for monitoring
- **Unit Tests**: Comprehensive test coverage with JUnit 5

## 🛠️ Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## 📦 Installation & Setup

### Quick Start

1. **Clone and Navigate**

   ```bash
   cd backend-java
   ```

2. **Build the Application**

   ```bash
   mvn clean install
   ```

3. **Run the Application**

   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:3001`

### Alternative: Using JAR

1. **Build JAR**

   ```bash
   mvn clean package
   ```

2. **Run JAR**
   ```bash
   java -jar target/equitrack-backend-1.0.0.jar
   ```

## 🏗️ Project Structure

```
backend-java/
├── src/
│   ├── main/
│   │   ├── java/com/equitrack/
│   │   │   ├── controller/          # REST controllers
│   │   │   │   └── PositionController.java
│   │   │   ├── model/              # Data models
│   │   │   │   ├── Position.java
│   │   │   │   ├── Trade.java
│   │   │   │   ├── Transaction.java
│   │   │   │   ├── TransactionAction.java
│   │   │   │   └── TransactionSide.java
│   │   │   ├── service/            # Business logic
│   │   │   │   └── PositionService.java
│   │   │   └── EquiTrackApplication.java
│   │   └── resources/
│   │       └── application.yml     # Configuration
│   └── test/
│       └── java/com/equitrack/
│           └── service/
│               └── PositionServiceTest.java
├── pom.xml                         # Maven configuration
└── README.md
```

## 🔧 API Endpoints

### Base URL: `http://localhost:3001/api`

| Method | Endpoint             | Description               | Request Body        | Response                  |
| ------ | -------------------- | ------------------------- | ------------------- | ------------------------- |
| GET    | `/positions`         | Get all current positions | -                   | `List<Position>`          |
| GET    | `/trades`            | Get all trades            | -                   | `List<Trade>`             |
| POST   | `/transactions`      | Add a single transaction  | `Transaction`       | `TransactionResponse`     |
| POST   | `/transactions/bulk` | Add multiple transactions | `List<Transaction>` | `BulkTransactionResponse` |
| POST   | `/reset`             | Reset all data            | -                   | `MessageResponse`         |
| POST   | `/load-sample`       | Load sample data          | -                   | `SampleDataResponse`      |
| GET    | `/health`            | Health check              | -                   | `HealthResponse`          |

### Example API Usage

#### Get Positions

```bash
curl http://localhost:3001/api/positions
```

#### Add Transaction

```bash
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

#### Add Bulk Transactions

```bash
curl -X POST http://localhost:3001/api/transactions/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {
      "tradeId": 1,
      "version": 1,
      "securityCode": "REL",
      "quantity": 50,
      "action": "INSERT",
      "side": "Buy"
    },
    {
      "tradeId": 2,
      "version": 1,
      "securityCode": "ITC",
      "quantity": 40,
      "action": "INSERT",
      "side": "Sell"
    }
  ]'
```

## 🧪 Testing

### Run All Tests

```bash
mvn test
```

### Run Specific Test

```bash
mvn test -Dtest=PositionServiceTest#testSampleDataProcessing
```

### Test Coverage

The application includes comprehensive unit tests covering:

- Sample data processing
- Individual transaction types (INSERT, UPDATE, CANCEL)
- Mixed buy/sell scenarios
- Data clearing functionality

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

## 🔒 Validation

The application includes comprehensive validation:

- **Trade ID**: Must be positive
- **Version**: Must be positive
- **Security Code**: Must not be blank
- **Quantity**: Must be positive
- **Action**: Must be INSERT, UPDATE, or CANCEL
- **Side**: Must be Buy or Sell

## 🚀 Deployment

### Development

```bash
mvn spring-boot:run
```

### Production

```bash
mvn clean package
java -jar target/equitrack-backend-1.0.0.jar
```

### Docker (Optional)

```bash
# Build Docker image
docker build -t equitrack-backend .

# Run Docker container
docker run -p 3001:3001 equitrack-backend
```

## 🔧 Configuration

The application can be configured via `application.yml`:

```yaml
server:
  port: 3001

spring:
  application:
    name: equitrack-backend

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

## 📈 Monitoring

The application includes Spring Boot Actuator for monitoring:

- **Health Check**: `http://localhost:3001/actuator/health`
- **Application Info**: `http://localhost:3001/actuator/info`

## 🤝 Integration with Frontend

This Java backend is designed to work seamlessly with the React frontend. The API endpoints match the original Node.js backend, ensuring compatibility.

## 📝 License

This project is licensed under the MIT License.

---

**EquiTrack Java Backend** - Enterprise-grade equity position tracking with Spring Boot! 🚀
