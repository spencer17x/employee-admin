import { Card } from 'antd';

import { useUserStore } from '@/stores/user.ts';

export const Profile = () => {
	const user = useUserStore(state => state.user);

	return <Card title={user?.name} bordered={false}>
		<p>account: {user?.account}</p>
		<p>password: {user?.password}</p>
		<p>name: {user?.name}</p>
		<p>age: {user?.age}</p>
		<p>gender: {user?.gender}</p>
	</Card>;
};