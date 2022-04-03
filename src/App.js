import React from 'react';
import {Route} from "./Route";
import {
	AdaptivityProvider,
	ConfigProvider
} from '@vkontakte/vkui';

import './styles/App.css';
import '@vkontakte/vkui/dist/vkui.css';


const App = () => (
	<ConfigProvider>
		<AdaptivityProvider>
			<Route/>
		</AdaptivityProvider>
	</ConfigProvider>
);

export default App;
