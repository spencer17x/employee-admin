import { Button, Form, Input, message, Radio } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { UserStore, useUserStore } from '@/stores/user.ts';
import { request } from '@/apis/request.ts';
import { useState } from 'react';

export const Update = () => {
	const { user, updateUser } = useUserStore();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: UserStore['user']) => {
		try {
			setLoading(true);
			const response = await request.patch<UserStore['user'], UserStore['user']>('/user/profile', {
				...values,
				age: Number(values?.age)
			});
			updateUser(response);
			message.success('Update success');
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return <Form
		className="w-[360px]"
		name="login"
		initialValues={user || {}}
		onFinish={onFinish}
	>
		<Form.Item
			name="account"
		>
			<Input disabled={true} prefix={<UserOutlined/>} placeholder="Account"/>
		</Form.Item>
		<Form.Item
			name="password"
		>
			<Input prefix={<LockOutlined/>} placeholder="Password"/>
		</Form.Item>

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

		<Form.Item className="text-[#1677ff]">
			<Button loading={loading} block type="primary" htmlType="submit">
				Update
			</Button>
		</Form.Item>
	</Form>;
};