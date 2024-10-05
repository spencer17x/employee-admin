import axios from 'axios';
import { message } from 'antd';

export const request = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL + '/api'
});

request.interceptors.request.use((config) => {
	config.headers.set(
		'Authorization',
		localStorage.getItem('authorization') || ''
	);
	return config;
});

request.interceptors.response.use((response) => {
	return response.data;
}, (error) => {
	message.error(error.message);
	return Promise.reject(error);
});