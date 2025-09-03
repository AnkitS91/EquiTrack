import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  message,
  Spin,
  Typography,
  Space,
  ConfigProvider,
  theme,
  Avatar,
  Dropdown,
  Badge,
  Divider
} from 'antd';
import {
  DashboardOutlined,
  PlusOutlined,
  HistoryOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuOutlined
} from '@ant-design/icons';
import PositionsDashboard from './components/PositionsDashboard';
import TransactionForm from './components/TransactionForm';
import TradesTable from './components/TradesTable';
import { Position, Trade } from './types';
import { apiService } from './services/api';
import { useResponsive } from './hooks/useResponsive';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const { isMobile, isSmallScreen } = useResponsive();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [positionsData, tradesData] = await Promise.all([
        apiService.getPositions(),
        apiService.getTrades()
      ]);
      setPositions(positionsData);
      setTrades(tradesData);
      message.success('Data refreshed successfully');
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async (transaction: any) => {
    setLoading(true);
    try {
      const response = await apiService.addTransaction(transaction);
      setPositions(response.positions);
      
      // Refresh trades data to show the new trade
      const tradesData = await apiService.getTrades();
      setTrades(tradesData);
      
      message.success('Transaction added successfully');
      setSelectedMenu('dashboard');
    } catch (error) {
      message.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleData = async () => {
    setLoading(true);
    try {
      const response = await apiService.loadSampleData();
      setPositions(response.positions);
      
      // Refresh trades data to show all trades
      const tradesData = await apiService.getTrades();
      setTrades(tradesData);
      
      message.success('Sample data loaded successfully');
    } catch (error) {
      message.error('Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    try {
      await apiService.resetData();
      setPositions([]);
      setTrades([]);
      message.success('Data reset successfully');
    } catch (error) {
      message.error('Failed to reset data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Positions Dashboard',
    },
    {
      key: 'transaction',
      icon: <PlusOutlined />,
      label: 'Add Transaction',
    },
    {
      key: 'trades',
      icon: <HistoryOutlined />,
      label: 'Trades History',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <PositionsDashboard positions={positions} isLoading={loading} />;
      case 'transaction':
        return <TransactionForm onSubmit={handleTransactionSubmit} onClear={() => {}} />;
      case 'trades':
        return <TradesTable trades={trades} />;
      default:
        return <PositionsDashboard positions={positions} isLoading={loading} />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            background: '#001529',
            boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          }}
        >
          <div style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid #303030'
          }}>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              {collapsed ? 'ET' : 'EquiTrack'}
            </Title>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenu]}
            items={menuItems}
            onClick={({ key }) => setSelectedMenu(key)}
            style={{ borderRight: 0 }}
          />
        </Sider>
        
        <Layout>
          <Header style={{ 
            padding: isMobile ? '0 8px' : '0 16px', 
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <Space>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}
              />
              <Title level={4} style={{ margin: 0, fontSize: isMobile ? '16px' : '18px' }}>
                {menuItems.find(item => item.key === selectedMenu)?.label}
              </Title>
            </Space>
            
            <Space size="small" wrap>
              <Space size="small" wrap>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchData}
                  loading={loading}
                  size="small"
                >
                  <span style={{ display: isSmallScreen ? 'none' : 'inline' }}>Refresh</span>
                </Button>
                <Button 
                  icon={<DatabaseOutlined />} 
                  onClick={handleLoadSampleData}
                  loading={loading}
                  size="small"
                >
                  <span style={{ display: isSmallScreen ? 'none' : 'inline' }}>Sample</span>
                </Button>
                <Button 
                  icon={<DeleteOutlined />} 
                  onClick={handleResetData}
                  danger
                  size="small"
                >
                  <span style={{ display: isSmallScreen ? 'none' : 'inline' }}>Reset</span>
                </Button>
              </Space>
              
              <Divider type="vertical" style={{ display: isSmallScreen ? 'none' : 'block' }} />
              
              <Space size="small">
                <Badge count={3}>
                  <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    style={{ fontSize: '16px' }}
                    size="small"
                  />
                </Badge>
                
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <Text style={{ display: isSmallScreen ? 'none' : 'inline' }}>Admin</Text>
                  </Space>
                </Dropdown>
              </Space>
            </Space>
          </Header>
          
          <Content style={{ 
            margin: isMobile ? '8px' : isSmallScreen ? '16px' : '24px',
            padding: isMobile ? '12px' : isSmallScreen ? '16px' : '24px',
            background: '#f5f5f5',
            borderRadius: 8,
            minHeight: 280
          }}>
            <Spin spinning={loading} tip="Loading...">
              {renderContent()}
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
