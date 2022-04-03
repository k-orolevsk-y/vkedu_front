import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {transition} from "@unexp/router";
import {
	Avatar, Button,
	Footer,
	Group,
	List,
	Panel,
	Placeholder,
	ScreenSpinner,
	SimpleCell,
	Spacing,
	Title
} from '@vkontakte/vkui';
import {
	Icon56GhostOutline,
	Icon56ReportOutline,
	Icon28ArrowRightOutline,
} from "@vkontakte/icons";
import {PHeader} from "../assets/PHeader";
import {Post} from "../assets/Post";

import API from "../assets/API";
import useCheckMobileScreen from "../assets/useCheckMobileScreen";


export const Newsfeed = ({ nav, snackBar, popout }) => {
	const [user,] = useState(!localStorage.getItem('user_profile') ? null : JSON.parse(localStorage.getItem('user_profile')))
	const [response, setResponse] = useState({});

	useEffect(() => {
		popout(<ScreenSpinner/>);

		API.newsfeedGet().then(result => {
			if(result === undefined) return;

			popout(null);
			if(!result?.ok) {
				setResponse(false);
			} else {
				setResponse(result?.response);
			}
		}).catch(e => {
			console.log("⚠️ Не удалось получить данные (newsfeed.get): ", e);

			popout(null);
			setResponse(false);
		})
	}, []);

	return (
		<Panel nav={nav}>
			<PHeader
			>
				Лента
			</PHeader>

			<Group
				style={{
					display: `${response === false || response?.count < 1 ? "none" : "block"}`
				}}
				separator="show"
			>
				<SimpleCell
					before={
						user && <Avatar size={28} src={user?.photo}/>
					}
					after={<Icon28ArrowRightOutline/>}
					className="Newsfeed_new"
					onClick={() => {
						transition('/new');
					}}
				>
					Что у вас нового?
				</SimpleCell>
			</Group>
			<List>
				<Title
					style={{
						display: `${Object.keys(response).length < 1 || response?.count < 1 ? "none" : "block"}`, // Подобная реализация, из-за слишком большого количества рендера, по сравнению с предыдущим.
						margin: `${useCheckMobileScreen() ? '20px 0' : '0 0 20px 0'}`,
						textAlign: "center"
					}}
				>
					Для вас
				</Title>
				{response?.items?.map((item, key) => {
					const profile = response?.profiles[item?.user_id];
					if(!profile) return;

					return (
						<div key={key}>
							<Post
								item={item}
								profile={profile}
								snackBar={snackBar}
							/>
							<Spacing/>
						</div>
					);
				})}
			</List>

			<Placeholder
				header={response === false ? "Как так?" : "Вот это да!"}
				icon={response === false ? <Icon56ReportOutline fill="red"/> : <Icon56GhostOutline fill="var(--accent)"/>}
				style={{
					display: `${response === false || response?.count < 1 ? "inherit" : "none"}`
				}}
				action={response?.count < 1 &&
					<Button
						size="l"
						mode="outline"
						onClick={() => {
							transition('/new');
						}}
						stretched={true}
					>
						Создать!
					</Button>
				}
				stretched={true}
			>
				{response === false ?
					<>Произошла техническая ошибка при получении постов.<br/>Попробуйте обновить страницу.</>
					:
					<>У нас пока нет постов.<br/>Давайте вы будете первым, кто его создаст?</>
				}
			</Placeholder>

			{response?.count >= 1 &&
				<Footer>Вы просмотрели {API.pluralForm(response?.count, [ 'пост', 'поста', 'постов' ])}! На сегодня это все...</Footer>
			}
			{snackBar()}
		</Panel>
	);
};

Newsfeed.propTypes = {
	nav: PropTypes.string.isRequired,
	snackBar: PropTypes.func.isRequired,
	popout: PropTypes.func.isRequired,
};