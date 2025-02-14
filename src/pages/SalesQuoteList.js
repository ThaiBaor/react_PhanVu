import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import dayjs from "dayjs";
import {
	ReloadOutlined,
	EllipsisOutlined,
	SearchOutlined
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
	Dropdown,
	Space,
	theme
} from 'antd';
import { formatDate } from '../utils/format';
import { Link } from 'react-router-dom';
const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const SalesQuoteList = () => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const navigate = useNavigate();
	//const projects = useSelector((state) => state.projects.projects);
	const projects = localStorage.getItem('projects') ? JSON.parse(localStorage.getItem('projects')) : [];
	const [salesQuoteList, setSalesQuoteList] = useState([]);
	const [selectedSalesQuote, setSelectedSalesQuote] = useState([]);
	const [rootSalesQuote, setRootSalesQuote] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isAll, setIsAll] = useState(false);
	const [fromDate, setFromDate] = useState();
	const [toDate, setToDate] = useState();
	const [api, contextHolder] = notification.useNotification();
	const openNotificationWithIcon = (type, message, description) => {
		api[type]({
			message: message,
			description: description
		});
	};
	const handle = async (internalIDs) => {
		try {
			setLoading(true);
			const response = await axios.post('http://localhost:5000/api/getMaterialsByInternalIDs', { InternalIDs: internalIDs });

		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	}
	const contextMenuItems = [{
		label: (
			<a href="#">Create Purchase Contract</a>
		),
		key: '0',
		onClick: () => {
		}
	},
	{
		label: (
			<Link to={"/SalesQuoteList/CreateSalesOrder"} state={selectedSalesQuote}>Create Sales Order</Link>
		),
		key: '1',
		onClick: async () => {
			if (selectedSalesQuote.SalesOrderID !== "") {
				openNotificationWithIcon('error', 'Error', 'SQ này đã có SO vui lòng kiểm tra lại SO');
				return;
			};
			try {
				setLoading(true);

			} catch (error) {
				openNotificationWithIcon('error', 'Error', error.message);
				console.error('Error fetching Sales Quote:', error);
			} finally {
				setLoading(false);
			}
		}
	}];
	const salesQuoteColumns = [
		{
			title: '', dataIndex: '0', render: (text, record) =>
				<Dropdown
					onOpenChange={(open) => {
						if (open) {
							setSelectedSalesQuote(record);
							//const internalIDs = [...new Set(record.CustomerQuoteItem.map(item => item.ProductID))];
							//const filterInternalIDs = internalIDs.filter(item => item[0] != '2');
							//handle(filterInternalIDs);
						}
					}}
					menu={{ items: contextMenuItems }}
					trigger={['click']}>
					<EllipsisOutlined />
				</Dropdown>
		},
		{ title: 'Dự Án', dataIndex: 'ProjectID' },
		{ title: 'SQ ID', dataIndex: 'SalesQuoteID' },
		{ title: 'SO ID', dataIndex: 'SalesOrderID' },
		{ title: 'Contract ID', dataIndex: 'ContractID' },
		{ title: 'Tên', dataIndex: 'SalesQuoteName' },
		{ title: 'Trạng Thái', dataIndex: 'LifeCycleStatusCodeText' },
		{ title: 'Sales Unit', dataIndex: 'SalesUnitID' },
		{ title: 'Employee', dataIndex: 'EmployeeResponsibleName' },
		{ title: 'Start Date', dataIndex: 'RequestedStartDate' },
		{ title: 'End Date', dataIndex: 'RequestedEndDate' },
		{ title: 'Create Date', dataIndex: 'CreationDateTime' },
	];
	// Loading top 100 Sales Quote when page loads
	useEffect(() => {
		const fetchSalesQuote = async () => {
			try {
				if (projects.length === 0) {
					openNotificationWithIcon('error', 'Missing data', "Projects is missing, please check again");
					return;
				}
				setLoading(true);
				const response = await axios.get('http://localhost:5000/api/getAllSalesQuoteHeader?top=true');
				if (response?.data?.d?.results) {
					setSalesQuoteList(parseApiData(response.data.d.results));
					const rootSalesQuote = parseApiData(response.data.d.results);
					setRootSalesQuote(rootSalesQuote);
					setLoading(false);
				}
			} catch (error) {
				openNotificationWithIcon('error', 'Error', error.message);
				console.error('Error fetching Sales Quote:', error);
				setLoading(false);
			}
		}
		fetchSalesQuote();
	}, []);
	const handleChangeFromDate = (date, dateString) => {

		if (dateString !== '') {
			const formattedDate = formatDate(dateString);
			setFromDate(formattedDate);
		} else {
			setFromDate('');
		}

	}
	const handleChangeToDate = (date, dateString) => {
		if (dateString !== '') {
			const formattedDate = formatDate(dateString);
			setToDate(formattedDate);
		} else {
			setToDate('');
		}

	}
	// Parsing raw data to neccessary data
	const parseApiData = (data) => {
		let projectID = "";
		const parseApiData = data.map((item) => {
			const objectID = item.ObjectID;
			let salesOrderID = "";
			let contractID = "";
			if (item.CustomerQuoteItem.length > 0) {
				const ProjectTaskUUID = item.CustomerQuoteItem[0]?.ProjectTaskUUID;
				if (ProjectTaskUUID) {
					const projectID_temp = projects.filter(project => project?.ProjectUUID === ProjectTaskUUID);
					if (projectID_temp.length > 0) {
						projectID = projectID_temp[0].ProjectID;
					}
				};
				salesOrderID = item.CustomerQuoteItem[0]?.SO_ID_KUT;
				const uniqueSet = new Set();
				item.CustomerQuoteItem.forEach(x => {
					if (x.ParentObjectID === objectID) {
						if (x.ContractID1_KUT && !uniqueSet.has(x.ContractID1_KUT)) {
							uniqueSet.add(x.ContractID1_KUT);
							contractID += `${x.ContractID1_KUT},`
						}
					}
				});
			}
			return {
				key: item.SalesQuoteID,
				ObjectID: item.ObjectID,
				ProjectID: projectID,
				CustomerID: item.CustomerID,
				SalesQuoteID: item.SalesQuoteID,
				SalesOrderID: salesOrderID,
				ContractID: contractID,
				SalesQuoteName: item.SalesQuoteName,
				CustomerQuoteItem: item.CustomerQuoteItem,
				LifeCycleStatusCodeText: item.LifeCycleStatusCodeText,
				SalesUnitID: item.SalesUnitID,
				EmployeeResponsibleName: item.EmployeeResponsibleName,
				RequestedStartDate: dayjs(item.RequestedStartDate).format("DD-MM-YYYY"),
				RequestedEndDate: dayjs(item.RequestedEndDate).format("DD-MM-YYYY"),
				CreationDateTime: dayjs(Number(item.CreationDateTime.match(/\d+/)[0])).format("DD-MM-YYYY")
			}
		});
		return parseApiData;
	}
	// Loading top 100 Sales Quote
	const resetTable = () => {
		try {
			if (projects.length === 0) {
				openNotificationWithIcon('error', 'Missing data', "Projects is missing, please check again");
				return;
			}
			setLoading(true);
			const response = axios.get(`http://localhost:5000/api/getAllSalesQuoteHeader?top=true`);
			if (response?.data?.d?.results) {
				setSalesQuoteList(parseApiData(response.data.d.results));
				const rootSalesQuote = parseApiData(response.data.d.results);
				setRootSalesQuote(rootSalesQuote);
				setLoading(false);
			}
		} catch (error) {
			openNotificationWithIcon('error', 'Error fetching data', error.message);
			setLoading(false);
		}
	}
	// Searching Sales Quote by SQ ID
	const onSearch = (value) => {
		if (value) {
			try {
				setLoading(true);
				const response = axios.post(`http://localhost:5000/api/getSalesQuoteHeaderBySQID`, { sqid: value });
				if (response?.data?.d?.results) {
					setSalesQuoteList(parseApiData(response.data.d.results));
					setIsAll(false);
				}
			} catch (error) {
				openNotificationWithIcon('error', 'Error fetching data', error);
			} finally {
				setLoading(false);
			}
		}
	}
	// Loading top 10000 Sales Quote
	const getAll = async () => {
		try {
			if (projects.length === 0) {
				openNotificationWithIcon('error', 'Missing data', "Projects is missing, please check again");
				return;
			}
			setLoading(true);
			const response = await axios.get(`http://localhost:5000/api/getAllSalesQuoteHeader`);
			if (response?.data?.d?.results) {
				setSalesQuoteList(parseApiData(response.data.d.results));
				setRootSalesQuote(salesQuoteList);
				setIsAll(true);
				setLoading(false);
			}
			console.log(response);
			
		} catch (error) {
			openNotificationWithIcon('error', 'Error fetching data', error);
			setLoading(false);
		}
	}
	// Filter by status
	const handleFilterByStatus = (value) => {
		setLoading(true);
		if (value) {
			const filtedSalesQuoteArray = rootSalesQuote.filter(item => item.LifeCycleStatusCodeText === value);
			setSalesQuoteList(filtedSalesQuoteArray);
		} else {
			setSalesQuoteList(rootSalesQuote);
		}
		setLoading(false);
	}
	// Filter by date
	const handleFilterByDate = () => {
		setLoading(true);
		if (fromDate !== '' && toDate !== '') {
			const filtedSalesQuoteArray = rootSalesQuote.filter(
				item => (Date.parse(formatDate(item.CreationDateTime)) >= Date.parse(fromDate) && Date.parse(formatDate(item.CreationDateTime)) <= Date.parse(toDate)));
			setSalesQuoteList(filtedSalesQuoteArray);
		} else {
			setSalesQuoteList(rootSalesQuote);
		}
		setLoading(false);
	}
	// Filter by project
	const handleFilterByProject = (value) => {
		setLoading(true);
		if (value) {
			const filtedSalesQuoteArray = rootSalesQuote.filter(item => item.ProjectID === value);
			setSalesQuoteList(filtedSalesQuoteArray);
		} else {
			setSalesQuoteList(rootSalesQuote);
		}
		setLoading(false);
	}
	return (
		<>
			{contextHolder}
			<Spin tip="Loading" size="large" spinning={loading} fullscreen> </Spin>
			<Title level={3}>Sales Quote List</Title>
			<div
				style={{
					padding: 15,
					minHeight: 360,
					background: colorBgContainer,
					borderRadius: borderRadiusLG,
				}}>
				<Row>
					<Col span={7}><Title style={{ marginTop: '0px' }} level={5}>Chọn dự án</Title></Col>
					<Col span={4}><Title style={{ marginTop: '0px' }} level={5}>Nhập số SQ</Title></Col>
					<Col span={3}><Title style={{ marginTop: '0px' }} level={5}>Trạng thái</Title></Col>
					<Col span={3}><Title style={{ marginTop: '0px' }} level={5}>Từ ngày</Title></Col>
					<Col span={3}><Title style={{ marginTop: '0px' }} level={5}>Đến ngày</Title></Col>
				</Row>
				<Row>
					<Col span={7}>
						<Select
							style={{ width: '95%', height: '30px' }}
							showSearch
							allowClear
							virtual={true}
							onChange={handleFilterByProject}
							placeholder="Chọn dự án"
							optionFilterProp="key"
							size='large'>
							{projects.map((item) => (
								<Option key={item.ProjectID} value={item.ProjectID}>
									{item.ProjectID} - {item.ProjectName}
								</Option>
							))}
						</Select>
					</Col>
					<Col span={4}>
						<Search onSearch={onSearch} style={{ width: '90%', height: '30px' }} allowClear placeholder="..." size='middle' enterButton />
					</Col>
					<Col span={3}>
						<Select
							style={{ width: '90%', height: '30px' }}
							showSearch
							allowClear
							virtual={true}
							onChange={handleFilterByStatus}
							placeholder="Trạng thái"
							optionFilterProp="label"
							size='large'
							options={[
								{
									value: 'Open',
									label: 'Open',
								},
								{
									value: 'In Process',
									label: 'In Process',
								},
								{
									value: 'Complete',
									label: 'Complete',
								}
							]}
						/>
					</Col>
					<Col span={3}>
						<DatePicker onChange={handleChangeFromDate} style={{ width: '90%', height: '30px' }} placeholder='Từ ngày' defaultValue={dayjs()} // Sets today's date as default
							format="DD-MM-YYYY" />
					</Col>
					<Col span={3}>
						<DatePicker onChange={handleChangeToDate} style={{ width: '90%', height: '30px' }} placeholder='Đến ngày' defaultValue={dayjs()} // Sets today's date as default
							format="DD-MM-YYYY" />
					</Col>
					<Col span={3}>
						<Space>
							<Button onClick={handleFilterByDate} color='primary' variant='solid' style={{ height: '30px' }} icon={<SearchOutlined />} />
							<Button onClick={resetTable} color='primary' variant='solid' style={{ height: '30px' }} icon={<ReloadOutlined />} />
							<Button onClick={getAll} disabled={isAll} color='blue' variant='outlined' style={{ height: '30px' }} >Show All</Button>
						</Space>
					</Col>
				</Row>
				<Row style={{ marginTop: '15px' }}>
					<Table
						columns={salesQuoteColumns}
						dataSource={salesQuoteList}
						style={{ width: '100%' }} />
				</Row>
			</div>
		</>
	)
}
export default SalesQuoteList
