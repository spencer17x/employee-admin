import { createHashRouter, Navigate } from 'react-router-dom';

import { Login } from '@/pages/Login';
import { User } from '@/pages/User';
import { Profile } from '@/pages/User/Profile';
import { Update } from '@/pages/User/Update';

export const router = createHashRouter([
	{
		path: '/',
		element: <Navigate to="/login"/>
	},
	{
		path: '/user',
		element: <User/>,
		children: [
			{
				index: true,
				element: <Navigate to="profile"/>
			},
			{
				path: 'profile',
				element: <Profile/>
			},
			{
				path: 'update',
				element: <Update/>
			},
		]
	},
	{
		path: '/login',
		element: <Login/>
	}
]);