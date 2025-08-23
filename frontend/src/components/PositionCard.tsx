import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { Position } from '../types';

interface PositionCardProps {
  position: Position;
}

const PositionCard: React.FC<PositionCardProps> = ({ position }) => {
  const isPositive = position.quantity > 0;
  const isNegative = position.quantity < 0;
  const isZero = position.quantity === 0;

  const getIcon = () => {
    if (isPositive) return <TrendingUp color="success" />;
    if (isNegative) return <TrendingDown color="error" />;
    return <Remove color="disabled" />;
  };

  const getColor = () => {
    if (isPositive) return 'success';
    if (isNegative) return 'error';
    return 'default';
  };

  const getQuantityText = () => {
    const sign = isPositive ? '+' : '';
    return `${sign}${position.quantity}`;
  };

  return (
    <Card 
      sx={{ 
        minWidth: 200,
        background: isPositive ? 'linear-gradient(135deg, #e8f5e8 0%, #f1f8f1 100%)' :
                   isNegative ? 'linear-gradient(135deg, #ffeaea 0%, #fef1f1 100%)' :
                   'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
        border: `2px solid ${
          isPositive ? '#4caf50' : isNegative ? '#f44336' : '#9e9e9e'
        }`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {position.securityCode}
          </Typography>
          {getIcon()}
        </Box>
        
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" component="div" fontWeight="bold" color={getColor()}>
            {getQuantityText()}
          </Typography>
          
          <Chip 
            label={isPositive ? 'LONG' : isNegative ? 'SHORT' : 'FLAT'}
            color={getColor() as any}
            variant={isZero ? 'outlined' : 'filled'}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" mt={1}>
          {isPositive ? 'Net Long Position' : isNegative ? 'Net Short Position' : 'No Position'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PositionCard;
