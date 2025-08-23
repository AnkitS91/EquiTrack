#!/bin/bash

echo "🚀 EquiTrack Java Backend Setup"
echo "================================"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

echo "✅ Java is installed: $(java -version 2>&1 | head -n 1)"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "⚠️  Maven is not installed. Installing Maven..."
    
    # Check if Homebrew is available (macOS)
    if command -v brew &> /dev/null; then
        echo "📦 Installing Maven via Homebrew..."
        brew install maven
    else
        echo "❌ Maven not found and Homebrew not available."
        echo "Please install Maven manually:"
        echo "1. Download from: https://maven.apache.org/download.cgi"
        echo "2. Extract to /usr/local/maven"
        echo "3. Add to PATH: export PATH=\$PATH:/usr/local/maven/bin"
        exit 1
    fi
fi

echo "✅ Maven is installed: $(mvn -version 2>&1 | head -n 1)"

# Build the project
echo "🔨 Building the project..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 To run the application:"
    echo "   mvn spring-boot:run"
    echo ""
    echo "🎯 To run tests:"
    echo "   mvn test"
    echo ""
    echo "🎯 To create JAR file:"
    echo "   mvn clean package"
else
    echo "❌ Build failed!"
    exit 1
fi
