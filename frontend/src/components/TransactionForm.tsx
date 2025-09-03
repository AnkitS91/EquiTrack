import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Divider,
  Alert,
  InputNumber,
  message
} from 'antd';
import {
  PlusOutlined,
  ClearOutlined,
  SaveOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Transaction } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'transactionId'>) => void;
  onClear: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClear }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const transaction: Omit<Transaction, 'transactionId'> = {
        tradeId: values.tradeId,
        version: values.version,
        securityCode: values.securityCode.toUpperCase(),
        quantity: values.quantity,
        action: values.action,
        side: values.side,
      };

      await onSubmit(transaction);
      form.resetFields();
      message.success('Transaction submitted successfully!');
    } catch (error) {
      message.error('Failed to submit transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
    message.info('Form cleared');
  };

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    form.setFieldsValue({ securityCode: value });
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>
            <PlusOutlined style={{ marginRight: 8 }} />
            Add New Transaction
          </Title>
          <Text type="secondary">
            Create a new transaction to update your positions. All fields are required.
          </Text>
        </div>

        <Alert
          message="Transaction Guidelines"
          description={
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li><strong>INSERT:</strong> Creates a new trade</li>
              <li><strong>UPDATE:</strong> Modifies an existing trade</li>
              <li><strong>CANCEL:</strong> Cancels an existing trade</li>
              <li>Security codes are automatically converted to uppercase</li>
              <li>Quantities can be positive (Buy) or negative (Sell)</li>
            </ul>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            action: 'INSERT',
            side: 'Buy',
            version: 1,
            quantity: 1
          }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Trade ID"
                name="tradeId"
                rules={[
                  { required: true, message: 'Please enter Trade ID' },
                  { type: 'number', min: 1, message: 'Trade ID must be a positive number' }
                ]}
              >
                <InputNumber
                  placeholder="Enter Trade ID"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Version"
                name="version"
                rules={[
                  { required: true, message: 'Please enter Version' },
                  { type: 'number', min: 1, message: 'Version must be a positive number' }
                ]}
              >
                <InputNumber
                  placeholder="Enter Version"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Security Code"
                name="securityCode"
                rules={[
                  { required: true, message: 'Please enter Security Code' },
                  { min: 1, max: 10, message: 'Security Code must be between 1 and 10 characters' }
                ]}
              >
                <Input
                  placeholder="e.g., REL, ITC, INF"
                  onChange={handleSecurityCodeChange}
                  maxLength={10}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  { required: true, message: 'Please enter Quantity' },
                  { type: 'number', min: 1, message: 'Quantity must be a positive number' }
                ]}
              >
                <InputNumber
                  placeholder="Enter Quantity"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Action"
                name="action"
                rules={[{ required: true, message: 'Please select Action' }]}
              >
                <Select placeholder="Select Action">
                  <Option value="INSERT">INSERT - Create new trade</Option>
                  <Option value="UPDATE">UPDATE - Modify existing trade</Option>
                  <Option value="CANCEL">CANCEL - Cancel existing trade</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Side"
                name="side"
                rules={[{ required: true, message: 'Please select Side' }]}
              >
                <Select placeholder="Select Side">
                  <Option value="Buy">Buy</Option>
                  <Option value="Sell">Sell</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                Submit Transaction
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                size="large"
              >
                Clear Form
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Alert
          message="Transaction Processing"
          description="Transactions are processed immediately and will update your positions in real-time. You can view the updated positions on the dashboard."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  );
};

export default TransactionForm;
