import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {transition} from "@unexp/router";
import {
    Button,
    CellButton,
    FormLayout,
    FormItem,
    Group,
    Input,
    Panel,
    PanelHeader,
    Placeholder,
    ScreenSpinner,
} from "@vkontakte/vkui";
import {
    Icon24DoneOutline,
    Icon24LockOutline,
    Icon28KeyOutline,
} from "@vkontakte/icons";
import {PFooter} from "../assets/PFooter";

import "../styles/Auth.css";

import API from "../assets/API";
import useCheckMobileScreen from "../assets/useCheckMobileScreen";

export const Auth = ({ nav, snackBar, popout }) => {
    const [seePassword, setSeePassword] = useState(false);
    const [login, setLogin] = useState(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        if(!!localStorage.getItem('access_token')) {
            setTimeout(() => {
                transition('/');
            }, 10); // Моментальный переход ломает работу роутера, поэтому делаем переход через 10мс.
        }
    }, []);

    return (
        <Panel nav={nav}>
            <PanelHeader>
                Лента
            </PanelHeader>

            <Group
                mode="plain"
                style={{
                    display: `${useCheckMobileScreen() ? "none" : "block"}`
                }}
                className="Auth_info_block"
            >
                <Placeholder
                    header="Лента новостей"
                >
                        <span>
                            Зарегистрируйтесь и получите доступ к бесконечной ленте новостей, которые публикуют ваши друзья!
                        </span>

                    <div
                        className="Auth_info_block_images"
                    >
                        <img
                            alt=""
                            src="https://vkedu.korolevsky.me/api/Files/iphone1.png"
                        />
                        <img
                            alt=""
                            src="https://vkedu.korolevsky.me/api/Files/iphone2.png"
                        />
                    </div>
                </Placeholder>
            </Group>

            <Group
                className="Auth_form_block"
            >
                <Placeholder
                    header="Авторизация"
                    icon={<Icon28KeyOutline width={56} height={56}/>}
                >
                    <span>Введите свой логин и пароль.</span>
                    <FormLayout>
                        <FormItem>
                            <Input
                                type="text"
                                placeholder="E-mail или никнейм"
                                onChange={e => setLogin(e?.target?.value)}
                            />
                        </FormItem>

                        <FormItem
                            className="Auth_form_block_password"
                        >
                            <Input
                                type={seePassword ? "text" : "password"}
                                placeholder="Пароль"
                                onChange={e => setPassword(e?.target?.value)}
                            />
                            <div
                                className="Auth_form_block_password_hide_button"
                                onClick={() => {
                                    setSeePassword(!seePassword);
                                }}
                            >
                                {!seePassword ?
                                    <svg fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.6c5.2 0 10.4 4.237 10.4 7.4 0 3.163-5.2 7.4-10.4 7.4S1.6 15.163 1.6 12c0-3.163 5.2-7.4 10.4-7.4zm0 1.8c-4.278 0-8.6 3.522-8.6 5.6s4.322 5.6 8.6 5.6 8.6-3.522 8.6-5.6-4.322-5.6-8.6-5.6zm0 2.2a3.4 3.4 0 110 6.8 3.4 3.4 0 010-6.8zm0 1.8a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z" fill="currentColor"></path></svg>
                                :
                                    <svg fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.593 6.41a.9.9 0 01-.092-1.797c2.759-.141 5.574.953 7.649 2.5.975.728 1.787 1.554 2.356 2.396.57.843.894 1.7.894 2.491 0 .94-.464 1.98-1.242 2.966a.9.9 0 11-1.413-1.116c.41-.519.855-1.167.855-1.85 0-.312-.139-.821-.585-1.483-.436-.645-1.097-1.33-1.941-1.96-1.835-1.37-4.169-2.265-6.48-2.147zM4.85 16.886C6.8 18.341 9.4 19.4 12 19.4c1.967 0 3.93-.607 5.604-1.523l1.26 1.26a.9.9 0 101.272-1.273l-13.5-13.5a.9.9 0 00-1.272 1.272l.683.684c-.418.246-.819.512-1.197.794-.975.727-1.787 1.553-2.356 2.395-.57.843-.894 1.7-.894 2.491 0 .79.325 1.648.894 2.49.569.842 1.381 1.669 2.356 2.396zM10.4 12a1.6 1.6 0 002.587 1.26l-2.247-2.247c-.213.272-.34.615-.34.987zm1.6 3.4a3.4 3.4 0 01-2.537-5.664L7.37 7.643c-.513.273-.998.581-1.444.914-.844.63-1.505 1.315-1.94 1.96-.448.662-.586 1.17-.586 1.483 0 .312.138.821.585 1.483.436.645 1.097 1.33 1.941 1.96C7.631 16.715 9.862 17.6 12 17.6c1.44 0 2.925-.401 4.269-1.058l-2.005-2.005A3.39 3.39 0 0112 15.4z" fill="currentColor" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                }
                            </div>
                        </FormItem>

                        <Button
                            size="l"
                            onClick={() => {
                                popout(<ScreenSpinner/>);
                                API.accountAuth(login, password).then(data => {
                                    if(!data.ok) {
                                        popout(null);
                                        snackBar(true, [ <Icon24LockOutline fill="red"/>, "Неверный логин или пароль." ]);
                                    } else {
                                        // Используется localStorage, чтобы сайт не забывал пользователя, если открыть ссылку в новой вкладке.
                                        localStorage.setItem('access_token', data?.response);
                                        API.usersGet().then(result => {
                                            if(!result.ok) return;

                                            localStorage.setItem('user_profile', JSON.stringify(result?.response));

                                            transition('/');
                                            popout(null);
                                            snackBar(true, [ <Icon24DoneOutline fill="green"/>, "Успешная авторизация!" ]);
                                        }).catch(e => {
                                            console.log("⚠️ Не удалось получить профиль пользователя: ", e);
                                        })
                                    }
                                }).catch(e => {
                                    console.log("⚠️ Ошибка авторизации: ", e)

                                    popout(null);
                                    snackBar(true, [ <Icon24LockOutline fill="red"/>, "Не удалось проверить данные." ]);
                                })
                            }}
                            disabled={(!/\S+@\S+\.\S+/.test(login) && !/^[A-Za-z][A-Za-z0-9_]{5,14}$/.test(login)) || password?.length < 2}
                            stretched={true}
                        >
                            Войти
                        </Button>
                        <Button
                            size="l"
                            mode="commerce"
                            className="Auth_form_block_main_button"
                            onClick={() => {
                                transition('/auth/register')
                            }}
                            stretched={true}
                        >
                            Зарегистрироваться
                        </Button>
                        <CellButton
                            className="Auth_form_block_reset_button"
                            onClick={() => {
                                snackBar(true, [ '😔', 'Данная кнопка к сожалению не работает :(' ])
                            }}
                            centered={true}
                        >
                            Забыли пароль?
                        </CellButton>
                    </FormLayout>
                </Placeholder>
            </Group>

            <PFooter
                style={{
                    display: `${useCheckMobileScreen() ? "none" : "block"}`
                }}
                after={!useCheckMobileScreen() &&`© ${new Date().getFullYear()}`}
            />
            {snackBar()}
        </Panel>
    )
}

Auth.prototype = {
    nav: PropTypes.string.isRequired,
    snackBar: PropTypes.func.isRequired,
    popout: PropTypes.func.isRequired
}