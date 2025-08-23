import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Refresh,
  DataUsage,
} from '@mui/icons-material';
import { Position, Trade, Transaction } from './types';
import { apiService } from './services/api';
import PositionsDashboard from './components/PositionsDashboard';
import TransactionForm from './components/TransactionForm';
import TradesTable from './components/TradesTable';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [positionsData, tradesData] = await Promise.all([
        apiService.getPositions(),
        apiService.getTrades(),
      ]);
      setPositions(positionsData);
      setTrades(tradesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async (transaction: Omit<Transaction, 'transactionId'>) => {
    try {
      const result = await apiService.addTransaction(transaction);
      setPositions(result.positions);
      await fetchData(); // Refresh trades as well
      showSnackbar('Transaction added successfully!', 'success');
    } catch (error) {
      console.error('Error adding transaction:', error);
      showSnackbar('Failed to add transaction', 'error');
    }
  };

  const handleLoadSampleData = async () => {
    try {
      const result = await apiService.loadSampleData();
      setPositions(result.positions);
      await fetchData(); // Refresh trades as well
      showSnackbar('Sample data loaded successfully!', 'success');
    } catch (error) {
      console.error('Error loading sample data:', error);
      showSnackbar('Failed to load sample data', 'error');
    }
  };

  const handleResetData = async () => {
    try {
      await apiService.resetData();
      setPositions([]);
      setTrades([]);
      showSnackbar('Data reset successfully!', 'info');
    } catch (error) {
      console.error('Error resetting data:', error);
      showSnackbar('Failed to reset data', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <AccountBalance sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              EquiTrack - Equity Position Tracker
            </Typography>
            <Button
              color="inherit"
              startIcon={<Refresh />}
              onClick={fetchData}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              color="inherit"
              startIcon={<DataUsage />}
              onClick={handleLoadSampleData}
              sx={{ mr: 1 }}
            >
              Load Sample
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleResetData}
            >
              Reset
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="EquiTrack tabs">
              <Tab label="Positions Dashboard" />
              <Tab label="Add Transaction" />
              <Tab label="Trades" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <PositionsDashboard positions={positions} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TransactionForm
              onSubmit={handleTransactionSubmit}
              onClear={() => {}}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TradesTable trades={trades} />
          </TabPanel>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
