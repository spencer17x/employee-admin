import { useEffect, useState } from 'react';
import { Button, Dropdown, Flex, Layout, Menu, Spin } from 'antd';
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

import { request } from '@/apis/request.ts';
import { UserStore, useUserStore } from '@/stores/user.ts';

const { Header, Sider, Content } = Layout;

const menuItems = [
	{
		key: 'profile',
		icon: <UserOutlined/>,
		label: 'Profile',
	},
	{
		key: 'update',
		icon: <UserOutlined/>,
		label: 'Update',
	}
];

const screenCenterCls = 'w-screen h-screen flex items-center justify-center';

export const User = () => {
	const { user, updateUser } = useUserStore();
	const navigate = useNavigate();

	const [collapsed, setCollapsed] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async function () {
			try {
				setLoading(true);
				const response = await request.get<UserStore['user'], UserStore['user']>('/user/profile');
				updateUser(response);
			} catch (e) {
				navigate('/login');
			} finally {
				setLoading(false);
			}
		}());
	}, []);

	if (loading) return <Spin className={screenCenterCls}/>;

	return <Layout className="w-screen h-screen">
		<Sider trigger={null} collapsible collapsed={collapsed}>
			<div className="demo-logo-vertical"/>
			<Menu
				theme="dark"
				mode="inline"
				defaultSelectedKeys={['profile']}
				items={menuItems}
				onClick={value => navigate(`/user/${value.key}`)}
			/>
		</Sider>
		<Layout>
			<Header className="p-0 bg-white pr-[20px]">
				<Flex justify="space-between">
					<Button
						className="text-[16px] w-[64px] h-[64px]"
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
						onClick={() => setCollapsed(!collapsed)}
					/>
					<Dropdown
						menu={{
							items: [
								{
									key: '1',
									label: <div
										className="select-none"
										onClick={() => {
											localStorage.clear();
											navigate({
												pathname: '/login'
											});
										}}
									>Logout</div>
								}
							]
						}}>
						<div className="cursor-pointer pl-[20px] select-none">{user?.name}</div>
					</Dropdown>
				</Flex>
			</Header>
			<Content
				className="m-[24px_16px] p-[24px] min-h-[280px] bg-white rounded-lg"
			>
				<Outlet/>
			</Content>
		</Layout>
	</Layout>;
};