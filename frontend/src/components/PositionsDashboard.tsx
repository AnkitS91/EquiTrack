import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Tag,
  Progress,
  Empty,
  Spin,
  Alert,
  Grid
} from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  DollarOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Position } from '../types';
import { useResponsive } from '../hooks/useResponsive';

const { Title, Text } = Typography;


interface PositionsDashboardProps {
  positions: Position[];
  isLoading?: boolean;
}

const PositionsDashboard: React.FC<PositionsDashboardProps> = ({ 
  positions, 
  isLoading = false 
}) => {
  const { isMobile, isSmallScreen } = useResponsive();

  
  const totalPositions = positions.length;
  const longPositions = positions.filter(p => p.quantity > 0).length;
  const shortPositions = positions.filter(p => p.quantity < 0).length;
  const flatPositions = positions.filter(p => p.quantity === 0).length;
  
  const totalExposure = positions.reduce((sum, p) => sum + Math.abs(p.quantity), 0);
  const netExposure = positions.reduce((sum, p) => sum + p.quantity, 0);
  const totalLong = positions.filter(p => p.quantity > 0).reduce((sum, p) => sum + p.quantity, 0);
  const totalShort = Math.abs(positions.filter(p => p.quantity < 0).reduce((sum, p) => sum + p.quantity, 0));

  const getPositionColor = (quantity: number) => {
    if (quantity > 0) return '#52c41a';
    if (quantity < 0) return '#ff4d4f';
    return '#8c8c8c';
  };

  const getPositionIcon = (quantity: number) => {
    if (quantity > 0) return <RiseOutlined />;
    if (quantity < 0) return <FallOutlined />;
    return <MinusOutlined />;
  };

  const getPositionTag = (quantity: number) => {
    if (quantity > 0) return <Tag color="success">LONG</Tag>;
    if (quantity < 0) return <Tag color="error">SHORT</Tag>;
    return <Tag color="default">FLAT</Tag>;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Loading positions...</Text>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              <Text type="secondary">No positions found</Text>
            </span>
          }
        >
          <Text type="secondary">Add some transactions to see positions here.</Text>
        </Empty>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Summary Statistics */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Total Positions"
              value={totalPositions}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: isSmallScreen ? '18px' : '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Long Positions"
              value={longPositions}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: isSmallScreen ? '18px' : '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Short Positions"
              value={shortPositions}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f', fontSize: isSmallScreen ? '18px' : '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Flat Positions"
              value={flatPositions}
              prefix={<MinusOutlined />}
              valueStyle={{ color: '#8c8c8c', fontSize: isSmallScreen ? '18px' : '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Exposure Summary */}
      <Card title="Exposure Summary" extra={<PieChartOutlined />} size="small">
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title="Total Exposure"
              value={totalExposure}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title="Net Exposure"
              value={netExposure}
              prefix={netExposure > 0 ? '+' : ''}
              valueStyle={{ 
                color: netExposure > 0 ? '#52c41a' : netExposure < 0 ? '#ff4d4f' : '#8c8c8c',
                fontSize: isSmallScreen ? '16px' : '20px'
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title="Total Long"
              value={totalLong}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title="Total Short"
              value={totalShort}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Col>
        </Row>
        
        {netExposure !== 0 && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Net Exposure Distribution:</Text>
            <Progress
              percent={Math.abs((netExposure / totalExposure) * 100)}
              status={netExposure > 0 ? 'success' : 'exception'}
              format={() => `${Math.abs(netExposure)} (${Math.abs((netExposure / totalExposure) * 100).toFixed(1)}%)`}
            />
          </div>
        )}
      </Card>

      {/* Positions Grid */}
      <Card title={`Current Positions (${positions.length})`} size="small">
        <Row gutter={[8, 8]}>
          {positions.map((position) => (
            <Col xs={12} sm={8} md={6} lg={4} key={position.securityCode}>
              <Card
                size="small"
                hoverable
                style={{
                  borderLeft: `4px solid ${getPositionColor(position.quantity)}`,
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5} style={{ margin: 0, fontSize: isSmallScreen ? '14px' : '16px' }}>
                      {position.securityCode}
                    </Title>
                    {getPositionIcon(position.quantity)}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Statistic
                      value={position.quantity}
                      valueStyle={{ 
                        color: getPositionColor(position.quantity),
                        fontSize: isSmallScreen ? '16px' : '20px',
                        fontWeight: 'bold'
                      }}
                      prefix={position.quantity > 0 ? '+' : ''}
                    />
                    {getPositionTag(position.quantity)}
                  </div>
                  
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    {position.quantity > 0 ? 'Net Long Position' : 
                     position.quantity < 0 ? 'Net Short Position' : 'No Position'}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Performance Alert */}
      {positions.length > 0 && (
        <Alert
          message="Portfolio Overview"
          description={`You have ${totalPositions} active positions with a total exposure of ${totalExposure.toLocaleString()} units. ${
            netExposure > 0 ? 'Your portfolio is net long.' : 
            netExposure < 0 ? 'Your portfolio is net short.' : 
            'Your portfolio is balanced.'
          }`}
          type="info"
          showIcon
        />
      )}
    </Space>
  );
};

export default PositionsDashboard;
