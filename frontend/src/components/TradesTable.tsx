import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle, Cancel, Edit } from '@mui/icons-material';
import { Trade } from '../types';

interface TradesTableProps {
  trades: Trade[];
}

const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  const getActionIcon = (trade: Trade) => {
    if (trade.isCancelled) {
      return <Cancel color="error" />;
    }
    return <CheckCircle color="success" />;
  };

  const getActionLabel = (trade: Trade) => {
    if (trade.isCancelled) {
      return 'CANCELLED';
    }
    return 'ACTIVE';
  };

  const getActionColor = (trade: Trade) => {
    if (trade.isCancelled) {
      return 'error';
    }
    return 'success';
  };

  const getSideColor = (side: string) => {
    return side === 'Buy' ? 'success' : 'error';
  };

  if (trades.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Trades
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No trades found. Add some transactions to see trades here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Trades ({trades.length})
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Trade ID</strong></TableCell>
              <TableCell><strong>Version</strong></TableCell>
              <TableCell><strong>Security Code</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Side</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow 
                key={trade.tradeId}
                sx={{
                  backgroundColor: trade.isCancelled ? '#fafafa' : 'inherit',
                  '&:hover': {
                    backgroundColor: trade.isCancelled ? '#f5f5f5' : '#f8f9fa',
                  }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight="bold">
                      {trade.tradeId}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={`v${trade.currentVersion}`}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {trade.securityCode}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {trade.quantity}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={trade.side}
                    color={getSideColor(trade.side) as any}
                    size="small"
                    variant="filled"
                  />
                </TableCell>
                
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getActionIcon(trade)}
                    <Chip 
                      label={getActionLabel(trade)}
                      color={getActionColor(trade) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TradesTable;
