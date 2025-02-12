import React, { useState } from 'react';
import {
	TeamOutlined,
	UserOutlined
} from '@ant-design/icons';
import {
	Layout,
	Menu,
	theme,
} from 'antd';
import Home from './pages/Home';
import SalesQuoteList from './pages/SalesQuoteList';
import { Link, Routes, Route } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const items = [
	{
		key: "main1",
		label: "Bán Hàng - QLDA",
		icon: <UserOutlined />,
		children: [
			{
				key: "main1_1",
				label: (<Link to={"/SalesQuoteList"}>Quản Lý Báo Giá</Link>)
			},
			{
				key: "main1_2",
				label: "Quản Lý Hợp Đồng Mua CKBT"
			},
			{
				key: "main1_3",
				label: "Quản Lý Đơn Bán Hàng (QLDA-CHT)"
			},
			{
				key: "main1_4",
				label: "Quản Lý Nhu Cầu CKBT"
			},
			{
				key: "main1_5",
				label: "Kế Hoạch Nhận Cọc"
			},
			{
				key: "main1_6",
				label: "Nhận Hàng Công Trường"
			},
			{
				key: "main1_7",
				label: "Tiêu Hao"
			},
			{
				key: "main1_8",
				label: "Kiểm Tra Tồn Kho"
			},
			{
				key: "main1_9",
				label: "Yêu Cầu Tạo Spec (Dự Án)"
			}
		]
	},
	{
		key: "main2",
		label: "Quản Lý Chuỗi Cung Ứng",
		icon: <TeamOutlined />,
		children: [
			{
				key: "main2_1",
				label: "Quản Lý Đơn Mua Hàng CKBT"
			},
			{
				key: "main2_2",
				label: "Ban Hành Nhu Cầu CKBT"
			},
			{
				key: "main2_3",
				label: "Kế Hoạch Giao Hàng"
			},
			{
				key: "main2_4",
				label: "Kiểm Tra Tồn Kho"
			},
		]
	}
]
const App = () => {
	const [collapsed, setCollapsed] = useState(false);
	const { token: { colorBgContainer } } = theme.useToken();
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider width={320} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
				<div className="demo-logo-vertical" />
				<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
			</Sider>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }} />
				<Content style={{ margin: '0 16px' }}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/SalesQuoteList' element={<SalesQuoteList />} />
					</Routes>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					PVI-PHÒNG CNTT©{new Date().getFullYear()}
				</Footer>
			</Layout>
		</Layout>
	);
};
export default App;