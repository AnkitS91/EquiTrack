import React, { useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Empty,
  Tooltip,
  Badge
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined,
  HistoryOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { Trade } from '../types';
import type { ColumnsType } from 'antd/es/table';
import { useResponsive } from '../hooks/useResponsive';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface TradesTableProps {
  trades: Trade[];
}

const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const { isMobile, isSmallScreen } = useResponsive();



  const getSideTag = (side: string) => {
    return side === 'Buy' ? (
      <Tag color="success" icon={<RiseOutlined />}>BUY</Tag>
    ) : (
      <Tag color="error" icon={<FallOutlined />}>SELL</Tag>
    );
  };

  const getStatusBadge = (isCancelled: boolean) => {
    return (
      <Badge 
        status={isCancelled ? 'error' : 'success'} 
        text={isCancelled ? 'Cancelled' : 'Active'}
      />
    );
  };

  const columns: ColumnsType<Trade> = [
    {
      title: 'Trade ID',
      dataIndex: 'tradeId',
      key: 'tradeId',
      sorter: (a, b) => a.tradeId - b.tradeId,
      defaultSortOrder: 'descend',
      width: 100,
      render: (tradeId) => (
        <Text strong style={{ fontFamily: 'monospace' }}>
          #{tradeId}
        </Text>
      ),
    },
    {
      title: 'Security',
      dataIndex: 'securityCode',
      key: 'securityCode',
      sorter: (a, b) => a.securityCode.localeCompare(b.securityCode),
      width: 120,
      render: (securityCode) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          {securityCode}
        </Tag>
      ),
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      width: 100,
      render: (side) => getSideTag(side),
      filters: [
        { text: 'Buy', value: 'Buy' },
        { text: 'Sell', value: 'Sell' },
      ],
      onFilter: (value, record) => record.side === value,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
      render: (quantity) => (
        <Text 
          strong 
          style={{ 
            color: quantity > 0 ? '#52c41a' : '#ff4d4f',
            fontSize: '16px'
          }}
        >
          {quantity > 0 ? '+' : ''}{quantity.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Version',
      dataIndex: 'currentVersion',
      key: 'currentVersion',
      width: 100,
      render: (version) => (
        <Tag color="default">v{version}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isCancelled',
      key: 'isCancelled',
      width: 120,
      render: (isCancelled) => getStatusBadge(isCancelled),
      filters: [
        { text: 'Active', value: false },
        { text: 'Cancelled', value: true },
      ],
      onFilter: (value, record) => record.isCancelled === value,
    },

    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = 
      trade.tradeId.toString().includes(searchText) ||
      trade.securityCode.toLowerCase().includes(searchText.toLowerCase()) ||
      trade.side.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !trade.isCancelled) ||
      (statusFilter === 'cancelled' && trade.isCancelled);
    
    const matchesSide = sideFilter === 'all' || trade.side === sideFilter;
    
    return matchesSearch && matchesStatus && matchesSide;
  });

  const totalTrades = trades.length;
  const activeTrades = trades.filter(t => !t.isCancelled).length;

  const buyTrades = trades.filter(t => t.side === 'Buy').length;
  const sellTrades = trades.filter(t => t.side === 'Sell').length;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <div>
        <Title level={3}>
          <HistoryOutlined style={{ marginRight: 8 }} />
          Trades History
        </Title>
        <Text type="secondary">
          View and manage all your trading transactions
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Total Trades"
              value={totalTrades}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Active Trades"
              value={activeTrades}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Buy Orders"
              value={buyTrades}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Sell Orders"
              value={sellTrades}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f', fontSize: isSmallScreen ? '16px' : '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card size="small">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search trades..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              size="small"
            />
          </Col>
          <Col xs={12} sm={12} md={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              size="small"
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} md={4}>
            <Select
              placeholder="Side"
              value={sideFilter}
              onChange={setSideFilter}
              style={{ width: '100%' }}
              size="small"
            >
              <Option value="all">All Sides</Option>
              <Option value="Buy">Buy</Option>
              <Option value="Sell">Sell</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space size="small" wrap>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('all');
                  setSideFilter('all');
                }}
                size="small"
              >
                <span style={{ display: isSmallScreen ? 'none' : 'inline' }}>Clear</span>
              </Button>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {filteredTrades.length} of {totalTrades} trades
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTrades}
          rowKey="tradeId"
          pagination={{
            pageSize: isSmallScreen ? 5 : 10,
            showSizeChanger: !isSmallScreen,
            showQuickJumper: !isSmallScreen,
            showTotal: !isSmallScreen ? (total, range) => 
              `${range[0]}-${range[1]} of ${total} trades` : undefined,
            pageSizeOptions: isSmallScreen ? ['5', '10'] : ['5', '10', '20', '50'],
            size: isSmallScreen ? 'small' : 'default',
          }}
          scroll={{ x: isSmallScreen ? 800 : 1200 }}
          size={isSmallScreen ? 'small' : 'middle'}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No trades found"
              />
            ),
          }}
        />
      </Card>
    </Space>
  );
};

export default TradesTable;
