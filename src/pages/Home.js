import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spin } from "antd";
import { useDispatch } from 'react-redux';
import { setProjects } from '../redux/features/projectSlice';
const Home = () => {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	// Loading All projects when page loads
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/getAllProjects');
				dispatch(setProjects(response?.data?.d?.results));
			} catch (error) {
				console.error('Error fetching projects:', error);
			} finally {
			}
		};
		fetchProjects();
	}, [dispatch]);
	useEffect(() => {
		setInterval(() => {
			setLoading(false)
		}, 3000)
	});
	const handleButton = async () => {
		try {
			const response = await axios.post('http://localhost:5000/api/postSalesOrder', { SalesOrderName: "Bao-test" });
			console.log(response);
		} catch (error) {
			console.error('Error post:', error);
		}
	}
	return (
		<>
			<Spin tip="HỆ THỐNG ĐANG KHỞI TẠO" size="large" spinning={loading} fullscreen> </Spin>
			<Button onClick={handleButton}>post</Button>
		</>
	);
}
export default Home