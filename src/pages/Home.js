import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spin } from "antd";
import { useDispatch } from 'react-redux';
import { setProjects } from '../redux/features/projectSlice';
import { setCustomers } from '../redux/features/customerSlice';
const Home = () => {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	// Loading All projects when page loads
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/getAllProjects');
				if(response?.data?.d?.results){
					//dispatch(setProjects(response?.data?.d?.results));
					localStorage.setItem('projects', JSON.stringify(response?.data?.d?.results));
				}
			} catch (error) {
				console.error('Error fetching projects:', error);
			}
		};
		fetchProjects();
		
	}, [dispatch]);
	useEffect(()=>{
		const fetchCustomer = async () =>{
			try {
				const response = await axios.get('http://localhost:5000/api/getAllCustomers');
				if(response?.data?.d?.results){
					//dispatch(setCustomers(response?.data?.d?.results));
					localStorage.setItem('customers', JSON.stringify(response?.data?.d?.results));
				}
			} catch (error) {
				console.error('Error fetching customers:', error);
			}
		};
		fetchCustomer();
	},[dispatch])
	useEffect(() => {
		setInterval(() => {
			setLoading(false)
		}, 5000)
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