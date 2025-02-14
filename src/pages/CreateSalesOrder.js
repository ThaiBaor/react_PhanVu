import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
	ReloadOutlined,
	MenuUnfoldOutlined
} from '@ant-design/icons';
import {
	notification,
	Select,
	Input,
	Col,
	Row,
	DatePicker,
	Button,
	Typography,
	Table,
	Spin,
	Space,
	theme
} from 'antd';
import { useLocation } from 'react-router-dom';
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateSalesOrder = () => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const [loading, setLoading] = useState(false);
	const [materialsConversion, setMaterialsConversion] = useState([]);
	const location = useLocation();
	const salesQuoteDetail = location.state;
	const [salesOrderDetail, setSalesOrderDetail] = useState(salesQuoteDetail.CustomerQuoteItem.map((item, index) => ({ ...item, key: index })));
	//const projects = useSelector((state) => state.projects.projects);
	//const customers = useSelector((state) => state.customers.customers);
	const projects = localStorage.getItem('projects') ? JSON.parse(localStorage.getItem('projects')) : [];
	const customers = localStorage.getItem('customers') ? JSON.parse(localStorage.getItem('customers')) : [];
	const [api, contextHolder] = notification.useNotification();
	const openNotificationWithIcon = (type, message, description) => {
		api[type]({
			message: message,
			description: description
		});
	};
	const salesOrderColumns = [
		{ title: 'Nhà Máy', dataIndex: 'FactoryIDCustom_SDK', render: (text, record) => record.FactoryIDCustom_SDK.slice(0, 7) },
		{ title: 'Hạng Mục', dataIndex: 'SalesQuoteID' },
		{ title: 'Nhóm Vật Tư', dataIndex: 'ProductCategoryID' },
		{ title: 'Tên Vật Tư', dataIndex: 'ProductID', render: (text, record) => `${record.ProductID} - ${record.Description}` },
		{ title: 'Mã Thiết Kế', dataIndex: '' },
		{
			title: 'Số Lượng (Md)', dataIndex: 'RequestedQuantity', render: (text, record) => {
				return new Intl.NumberFormat("en-US", {
					minimumFractionDigits: 0, // No decimal places
				}).format(record.RequestedQuantity)
			}
		},
		{
			title: 'Số Lượng (EA)', dataIndex: 'CorrespondingQuantity', render: (text, record) => {
				if (record.RequestedQuantityUnit !== 'MTR') {
					return new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 0, // No decimal places
					}).format(record.RequestedQuantity);
				};
				const x = materialsConversion.filter(item => item.Material.InternalID === record.ProductID && (item.CorrespondingQuantityUnitCode === "MTR" || item.CorrespondingQuantityUnitCode === "EA"));
				if (x.length > 0) {
					
					if (new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 0, // No decimal places
					}).format(x[0].CorrespondingQuantity) != 1) {
						return new Intl.NumberFormat("en-US", {
							minimumFractionDigits: 0, // No decimal places
						}).format(Number(record.RequestedQuantity) / Number(x[0].CorrespondingQuantity));
					}
					return new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 0, // No decimal places
					}).format(Number(record.RequestedQuantity) / Number(x[0].Quantity));
				}
			}
		},
		{ title: 'Đvt', dataIndex: 'RequestedQuantityUnit' },
		{
			title: 'Đơn Giá', dataIndex: 'NetPrice', render: (text, record) => new Intl.NumberFormat("en-US", {
				minimumFractionDigits: 0, // No decimal places
			}).format(record.NetPrice)
		},
		{
			title: 'Tổng Tiền', dataIndex: 'NetAmount', render: (text, record) => new Intl.NumberFormat("en-US", {
				minimumFractionDigits: 0, // No decimal places
			}).format(record.NetAmount)
		},
		{ title: 'Loại Tiền Tệ', dataIndex: 'CurrencyCode' },
		{ title: '', dataIndex: '0', render: () => <Button icon={<MenuUnfoldOutlined />}></Button> }
	];
	useEffect(() => {
		const fetchMaterialsConversion = async () => {
			try {
				setLoading(true);
				const response = await axios.post('http://localhost:5000/api/getMaterialsConversionByInternalIDs', { InternalIDs: salesQuoteDetail.CustomerQuoteItem.map(item => item.ProductID) });
				if (response?.data?.d?.results) {
					setMaterialsConversion(response.data.d.results);
				}
				setLoading(false);
			} catch (error) {
				console.error('Error fetching materialsConversion:', error);
				setLoading(false);
			}
		};
		fetchMaterialsConversion();
	}, [])
	return (
		<>
			{contextHolder}
			<Spin tip="Loading" size="large" spinning={loading} fullscreen> </Spin>
			<Title level={3}>Create Sales Order</Title>
			<div
				style={{
					padding: 15,
					minHeight: 360,
					background: colorBgContainer,
					borderRadius: borderRadiusLG,
				}}>
				<Row>
					<Col span={2}><Title style={{ marginTop: '0px' }} level={5}>Số Báo Giá</Title></Col>
					<Col span={4}><Title style={{ marginTop: '0px' }} level={5}>Tên Khách Hàng</Title></Col>
					<Col span={4}><Title style={{ marginTop: '0px' }} level={5}>Nội Dung Đơn Hàng</Title></Col>
					<Col span={4}><Title style={{ marginTop: '0px' }} level={5}>Đơn Vị Bán Hàng</Title></Col>
					<Col span={3}><Title style={{ marginTop: '0px' }} level={5}>Dự Án</Title></Col>

				</Row>
				<Row>
					<Col span={2} >
						<TextArea
							disabled
							style={{ width: '95%', height: '50px' }}
							value={salesQuoteDetail.SalesQuoteID} />
					</Col>
					<Col span={4}>
						<TextArea
							disabled
							style={{ width: '95%', height: '50px' }}
							value={
								`${salesQuoteDetail.CustomerID} - ${customers.filter(item => item.InternalID === salesQuoteDetail.CustomerID).BusinessPartnerFormattedName !== undefined ? customers.filter(item => item.InternalID === salesQuoteDetail.CustomerID).BusinessPartnerFormattedName : ""}`
							} />
					</Col>
					<Col span={4}>
						<TextArea
							style={{ width: '95%', height: '50px' }}
							value={salesQuoteDetail.SalesQuoteName} />
					</Col>
					<Col span={4}>
						<TextArea disabled style={{ width: '95%', height: '50px' }}
							value={salesQuoteDetail.SalesUnitID} />
					</Col>
					<Col span={6}>
						<TextArea
							disabled
							style={{ width: '95%', height: '50px' }}
							value={`${salesQuoteDetail.ProjectID} - ${projects.filter(item => item.ProjectID === salesQuoteDetail.ProjectID).ProjectName !== undefined ? projects.filter(item => item.ProjectID === salesQuoteDetail.ProjectID).ProjectName : ""}`} />

					</Col>
					<Col span={3} >
						<Button style={{ height: '50px' }}>Tạo Mới</Button>
					</Col>

					<Col span={1}>
						<Space>
							<Button onClick={null} color="primary" variant="solid" style={{ height: '30px' }} icon={<ReloadOutlined />} />
						</Space>
					</Col>
				</Row>
				<Row style={{ marginTop: '15px' }}>
					<Table
						columns={salesOrderColumns}
						dataSource={salesOrderDetail}
						style={{ width: '100%' }} />
				</Row>
				<Row>
					<Title level={5}>Chi Tiết</Title>
				</Row>
				<Row style={{ marginTop: '15px' }}>
					<Table
						showHeader={false}
						columns={salesOrderColumns}
						dataSource={null}
						style={{ width: '100%' }} />
				</Row>
			</div>
		</>
	);
};

export default CreateSalesOrder;