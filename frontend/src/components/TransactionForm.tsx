import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import { Add, Clear } from '@mui/icons-material';
import { Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'transactionId'>) => Promise<void>;
  onClear: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClear }) => {
  const [formData, setFormData] = useState({
    tradeId: '',
    version: '',
    securityCode: '',
    quantity: '',
    action: '',
    side: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tradeId) newErrors.tradeId = 'Trade ID is required';
    if (!formData.version) newErrors.version = 'Version is required';
    if (!formData.securityCode) newErrors.securityCode = 'Security Code is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.action) newErrors.action = 'Action is required';
    if (!formData.side) newErrors.side = 'Side is required';

    if (formData.quantity && isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a number';
    }

    if (formData.tradeId && isNaN(Number(formData.tradeId))) {
      newErrors.tradeId = 'Trade ID must be a number';
    }

    if (formData.version && isNaN(Number(formData.version))) {
      newErrors.version = 'Version must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        tradeId: Number(formData.tradeId),
        version: Number(formData.version),
        securityCode: formData.securityCode.toUpperCase(),
        quantity: Number(formData.quantity),
        action: formData.action as 'INSERT' | 'UPDATE' | 'CANCEL',
        side: formData.side as 'Buy' | 'Sell',
      });

      // Reset form on success
      setFormData({
        tradeId: '',
        version: '',
        securityCode: '',
        quantity: '',
        action: '',
        side: '',
      });
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      tradeId: '',
      version: '',
      securityCode: '',
      quantity: '',
      action: '',
      side: '',
    });
    setErrors({});
    onClear();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Transaction
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Trade ID"
              value={formData.tradeId}
              onChange={(e) => handleInputChange('tradeId', e.target.value)}
              error={!!errors.tradeId}
              helperText={errors.tradeId}
              type="number"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Version"
              value={formData.version}
              onChange={(e) => handleInputChange('version', e.target.value)}
              error={!!errors.version}
              helperText={errors.version}
              type="number"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Security Code"
              value={formData.securityCode}
              onChange={(e) => handleInputChange('securityCode', e.target.value)}
              error={!!errors.securityCode}
              helperText={errors.securityCode}
              placeholder="e.g., REL, ITC, INF"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Quantity"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              error={!!errors.quantity}
              helperText={errors.quantity}
              type="number"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth error={!!errors.action}>
              <InputLabel>Action</InputLabel>
              <Select
                value={formData.action}
                label="Action"
                onChange={(e) => handleInputChange('action', e.target.value)}
              >
                <MenuItem value="INSERT">INSERT</MenuItem>
                <MenuItem value="UPDATE">UPDATE</MenuItem>
                <MenuItem value="CANCEL">CANCEL</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth error={!!errors.side}>
              <InputLabel>Side</InputLabel>
              <Select
                value={formData.side}
                label="Side"
                onChange={(e) => handleInputChange('side', e.target.value)}
              >
                <MenuItem value="Buy">Buy</MenuItem>
                <MenuItem value="Sell">Sell</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClear}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TransactionForm;
