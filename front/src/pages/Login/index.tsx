import { Button, Flex, Form, Input, message, Radio, Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { request } from '@/apis/request.ts';
import { UserStore } from '@/stores/user.ts';

type TabActiveKey = 'signIn' | 'signUp';

const tabItems: Array<{
	key: TabActiveKey;
	label: string;
}> = [
	{
		key: 'signIn',
		label: 'Sign In',
	},
	{
		key: 'signUp',
		label: 'Sign Up',
	}
];

export const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [tabActiveKey, setTabActiveKey] = useState<TabActiveKey>('signIn');

	const signIn = async (values: UserStore['user']) => {
		try {
			setLoading(true);
			const response = await request.post<{ authorization: string }, { authorization: string }>('/sign-in', values);
			localStorage.setItem('authorization', response.authorization);
			message.success('Sign In Success');
			navigate('/user/profile');
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (values: UserStore['user']) => {
		try {
			setLoading(true);
			await request.post<UserStore['user'], UserStore['user']>('/sign-up', {
				...values,
				age: Number(values?.age)
			});
			message.success('Sign Up Success');
			setTabActiveKey('signIn');
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const onFinish = async (values: UserStore['user']) => {
		if (tabActiveKey === 'signIn') {
			signIn(values);
			return;
		}
		if (tabActiveKey === 'signUp') {
			signUp(values);
			return;
		}
	};

	const renderButtonText = () => {
		const tab = tabItems.find(item => item.key === tabActiveKey);
		return tab?.label;
	};

	return <Flex
		className="w-screen h-screen bg-[url('/assets/images/bg.webp')] bg-no-repeat bg-cover"
		justify="center"
		align="center"
	>
		<Form
			className="w-[360px]"
			name="login"
			onFinish={onFinish}
		>
			<Tabs
				activeKey={tabActiveKey}
				items={tabItems}
				onChange={value => setTabActiveKey(value as TabActiveKey)}
			/>
			<Form.Item
				name="account"
				rules={[{ required: true, message: 'Please input your Account!' }]}
			>
				<Input prefix={<UserOutlined/>} placeholder="Account"/>
			</Form.Item>
			<Form.Item
				name="password"
				rules={[{ required: true, message: 'Please input your Password!' }]}
			>
				<Input prefix={<LockOutlined/>} placeholder="Password"/>
			</Form.Item>

			{
				tabActiveKey === 'signUp' && <>
					<Form.Item
						name="name"
					>
						<Input placeholder="Name"/>
					</Form.Item>
					<Form.Item
						name="age"
					>
						<Input placeholder="Age"/>
					</Form.Item>
					<Form.Item
						name="gender"
					>
						<Radio.Group>
							<Radio value="male">male</Radio>
							<Radio value="female">female</Radio>
						</Radio.Group>
					</Form.Item>
				</>
			}

			<Form.Item className="text-[#1677ff]">
				<Button loading={loading} block type="primary" htmlType="submit">
					{renderButtonText()}
				</Button>
			</Form.Item>
		</Form>
	</Flex>;
};