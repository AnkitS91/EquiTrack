import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import { Position } from '../types';
import PositionCard from './PositionCard';

interface PositionsDashboardProps {
  positions: Position[];
  isLoading?: boolean;
}

const PositionsDashboard: React.FC<PositionsDashboardProps> = ({ 
  positions, 
  isLoading = false 
}) => {
  const totalPositions = positions.length;
  const longPositions = positions.filter(p => p.quantity > 0).length;
  const shortPositions = positions.filter(p => p.quantity < 0).length;
  const flatPositions = positions.filter(p => p.quantity === 0).length;
  
  const totalExposure = positions.reduce((sum, p) => sum + Math.abs(p.quantity), 0);
  const netExposure = positions.reduce((sum, p) => sum + p.quantity, 0);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loading positions...
        </Typography>
      </Box>
    );
  }

  if (positions.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Positions Dashboard
        </Typography>
        <Alert severity="info">
          No positions found. Add some transactions to see positions here.
        </Alert>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalPositions}
                  </Typography>
                  <Typography variant="body2">
                    Total Positions
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {longPositions}
                  </Typography>
                  <Typography variant="body2">
                    Long Positions
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {shortPositions}
                  </Typography>
                  <Typography variant="body2">
                    Short Positions
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {flatPositions}
                  </Typography>
                  <Typography variant="body2">
                    Flat Positions
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exposure Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Exposure Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold" color="primary">
                {totalExposure.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Exposure
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={netExposure > 0 ? 'success.main' : netExposure < 0 ? 'error.main' : 'text.primary'}
              >
                {netExposure > 0 ? '+' : ''}{netExposure.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Net Exposure
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {positions.filter(p => p.quantity > 0).reduce((sum, p) => sum + p.quantity, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Long
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {Math.abs(positions.filter(p => p.quantity < 0).reduce((sum, p) => sum + p.quantity, 0)).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Short
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Positions Grid */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Positions ({positions.length})
        </Typography>
        
        <Grid container spacing={3}>
          {positions.map((position) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={position.securityCode}>
              <PositionCard position={position} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PositionsDashboard;
