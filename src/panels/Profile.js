import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {transition, useParams} from "@unexp/router";
import {
    Avatar,
    Button,
    Gradient,
    Group,
    Header,
    List,
    Panel,
    Placeholder,
    ScreenSpinner,
    SimpleCell,
    Title
} from "@vkontakte/vkui";
import {
    Icon28EditOutline,
    Icon28UserOutline,
    Icon56Users3Outline,
    Icon28ListLikeOutline,
    Icon28ArrowRightOutline
} from "@vkontakte/icons";
import {PHeader} from "../assets/PHeader";
import {Post} from "../assets/Post";

import "../styles/Profile.css";

import API from "../assets/API";
import useCheckMobileScreen from "../assets/useCheckMobileScreen";

export const Profile = ({ nav, snackBar, popout }) => {
    const [user, setUser] = useState({});
    const [newsfeed, setNewsfeed] = useState({});
    const [thisUser,] = useState(JSON.parse(localStorage.getItem('user_profile') ?? "{}"))
    const params = useParams();

    useEffect(() => {
        popout(<ScreenSpinner/>)
        API.usersGet(params?.id ?? undefined).then(result => {
            if(result === undefined) return;
            else if(!result?.ok) {
                throw new Error(result?.error?.error_msg);
            }

            API.newsfeedGet(result?.response?.id).then(result_newsfeed => {
                if(result === undefined) return;

                popout(null);
                setUser(result?.response);

                if(result_newsfeed.ok) {
                    setNewsfeed(result_newsfeed?.response);
                }
            })
        }).catch(e => {
            console.log('⚠️ Произошла ошибка при получении пользователя: ', e);

            popout(null);
            setUser(false);
        })
    }, [])

    return (
        <Panel nav={nav}>
            <PHeader>
                Профиль
            </PHeader>

            {user === false &&
                <Placeholder
                    header="Такого пользователя не существует"
                    icon={<Icon56Users3Outline fill="var(--accent)"/>}
                    action={
                        <Button
                            size="l"
                            mode="outline"
                            onClick={() => {
                                window.location.href = "/profile"; // Подобный редирект из-за особенностей роутера...
                            }}
                            stretched={true}
                        >
                            Перейти в свой профиль
                        </Button>
                    }
                    stretched={true}
                >
                    Вы перешли по ссылке на несуществующего пользователя.<br/>Возможно, скоро он тут появиться, но пока его тут нет.
                </Placeholder>
            }

            <div
                style={{
                    display: `${Object.keys(user).length < 1 ? "none" : "block"}`
                }}
            >
                <Group
                    separator="show"
                    className="Profile_block"
                >
                    <Gradient>
                        <Avatar size={96} src={user?.photo}/>
                        <Title
                            level="2"
                            weight="2"
                        >
                            @{user?.nickname}
                        </Title>
                        {user?.id == thisUser?.id &&
                        <Button
                            size="m"
                            mode="secondary"
                            onClick={() => {
                                transition('/profile/edit')
                            }}
                        >
                            Редактировать профиль
                        </Button>
                        }
                        {useCheckMobileScreen() &&
                        <Button
                            size="s"
                            mode="destructive"
                            onClick={() => {
                                API.accountExitSession();
                                localStorage.clear();

                                transition('/auth');
                            }}
                        >
                            Выйти
                        </Button>
                        }
                    </Gradient>
                    <Group mode="plain">
                        <Header>Информация</Header>
                        <SimpleCell
                            before={<Icon28UserOutline/>}
                            after={API.genDate(user?.reg_time)}
                            disabled={true}
                        >
                            Дата регистрации
                        </SimpleCell>
                        <SimpleCell
                            before={<Icon28EditOutline/>}
                            after={user?.newsfeed_count}
                            disabled={true}

                        >
                            Количество постов
                        </SimpleCell>
                        <SimpleCell
                            before={<Icon28ListLikeOutline/>}
                            after={user?.likes_count}
                            disabled={true}

                        >
                            Поставлено лайков
                        </SimpleCell>
                    </Group>
                </Group>

                {user?.id == thisUser?.id &&
                    <Group separator="show">
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
                }

                {Object.keys(newsfeed).length > 1 &&
                    <List>
                        {newsfeed?.items?.map((item, key) => {
                            const profile = newsfeed?.profiles[item?.user_id];

                            return (
                                <Post
                                    key={key}
                                    item={item}
                                    profile={profile}
                                    snackBar={snackBar}
                                />
                            );
                        })}
                    </List>
                }
            </div>
            {snackBar()}
        </Panel>
    )
};

Profile.prototype = {
    nav: PropTypes.string.isRequired,
    snackBar: PropTypes.func.isRequired,
    popout: PropTypes.func.isRequired
}