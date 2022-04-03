import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Button,
    FormItem,
    FormLayout,
    Group,
    Headline,
    Input,
    Panel,
    PanelHeader, PanelHeaderBack,
    Placeholder,
    ScreenSpinner,
    Title
} from "@vkontakte/vkui";
import {
    Icon28CancelOutline,
    Icon28DoneOutline,
    Icon56CheckShieldOutline
} from "@vkontakte/icons";
import {PFooter} from "../assets/PFooter";

import "../styles/Register.css";

import API from "../assets/API";
import useCheckMobileScreen from "../assets/useCheckMobileScreen";

export const Register = ({ nav, snackBar, popout }) => {
    const [nickname, setNickname] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [stage, setStage] = useState(useCheckMobileScreen() ? -1 : 0);

    useEffect(() => {
        if(!!localStorage.getItem('access_token')) {
            setTimeout(() => {
                transition('/');
            }, 10); // Моментальный переход ломает работу роутера, поэтому делаем переход через 10мс.
        }
    }, []);


    return (
        <Panel
            nav={nav}
        >
            <PanelHeader
                left={useCheckMobileScreen() &&
                    <PanelHeaderBack
                        onClick={() => {
                            transition(-1);
                        }}
                    />
                }
            >
                Лента
            </PanelHeader>

            <Group
                className="Register_form"
            >
                <div
                    className="Register_form_container"
                >
                    {!useCheckMobileScreen() &&
                        <>
                            <div
                                className="Register_form_block_info"
                            >
                                <Placeholder
                                    icon={<Icon56CheckShieldOutline fill="var(--accent)"/>}
                                >
                                    Зарегистрируйтесь на нашем сайте и получите доступ к бесконечной ленте новостей от ваших друзей!
                                </Placeholder>
                            </div>
                            <span className="Register_form_container_separator">&nbsp;</span>
                        </>
                    }
                    <div
                        className="Register_form_container_layout"
                    >
                        {stage !== -1 &&
                            <Title
                                className="Register_form_container_layout_title"
                            >
                                Регистрация
                            </Title>
                        }
                        <FormLayout>
                            {stage === -1 &&
                            <Placeholder
                                header="Регистрация"
                                icon={<Icon56CheckShieldOutline fill="var(--accent)"/>}
                                action={
                                    <Button
                                        size="l"
                                        mode="commerce"
                                        stretched={true}
                                        onClick={() => setStage(0)}
                                    >
                                        Начать
                                    </Button>
                                }
                            >
                                Зарегистрируйтесь на нашем сайте и получите доступ к бесконечной ленте новостей от ваших друзей!
                            </Placeholder>
                            }
                            <div
                                style={{
                                    display: `${stage === 0 ? "block" : "none"}`
                                }}
                                className={useCheckMobileScreen() && "Animation_appearance"}
                            >
                                <Headline
                                    className="Register_form_container_layout_subtitle"
                                >
                                    Введите ваш никнейм
                                </Headline>
                                <FormItem>
                                    <Input
                                        placeholder="Никнейм"
                                        value={nickname}
                                        onChange={e => {
                                            setNickname(e?.target?.value.replace(' ', ''));
                                        }}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button
                                        mode="commerce"
                                        size="l"
                                        stretched={true}
                                        disabled={!/^[A-Za-z][A-Za-z0-9_]{5,14}$/.test(nickname)} // Thanks: https://stackoverflow.com/a/11214496
                                        onClick={() => setStage(1)}
                                    >
                                        Продолжить
                                    </Button>
                                </FormItem>
                            </div>
                            <div
                                style={{
                                    display: `${stage === 1 ? "block" : "none"}`
                                }}
                                className="Animation_appearance"
                            >
                                <Headline
                                    className="Register_form_container_layout_subtitle"
                                >
                                    Введите ваш E-mail
                                </Headline>
                                <FormItem>
                                    <Input
                                        placeholder="E-mail"
                                        value={login}
                                        onChange={e => {
                                            setLogin(e?.target?.value);
                                        }}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button
                                        mode="commerce"
                                        size="l"
                                        stretched={true}
                                        disabled={!/\S+@\S+\.\S+/.test(login)} // Thanks: https://stackoverflow.com/a/9204568
                                        onClick={() => setStage(2)}
                                    >
                                        Продолжить
                                    </Button>
                                </FormItem>
                            </div>
                            <div
                                style={{
                                    display: `${stage === 2 ? "block" : "none"}`
                                }}
                                className="Animation_appearance"
                            >
                                <Headline
                                    className="Register_form_container_layout_subtitle"
                                >
                                    Придумайте сложный пароль, который вы не использовали на других сайтах
                                </Headline>
                                <FormItem>
                                    <Input
                                        placeholder="Пароль"
                                        value={password}
                                        type="password"
                                        onChange={e => {
                                            setPassword(e?.target?.value);
                                        }}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button
                                        mode="commerce"
                                        size="l"
                                        stretched={true}
                                        disabled={password.length <= 6}
                                        onClick={() => {
                                            popout(<ScreenSpinner/>);
                                            API.accountRegister(login, password, nickname).then(result => {
                                                if(!result?.ok) {
                                                    const error_code = result?.error?.error_code;
                                                    switch(error_code) {
                                                        case 1:
                                                            snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Пользователь с данным логином уже существует!' ]);
                                                            setLogin("");
                                                            setStage(1);
                                                            break;
                                                        case 2:
                                                            snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Введена невалидная почта.' ]);
                                                            setLogin("");
                                                            setStage(1);
                                                            break;
                                                        case 3:
                                                            snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Введён невалидный пароль.' ]);
                                                            setPassword("");
                                                            break;
                                                        case 4:
                                                            snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Введен невалидный никнейм.' ]);
                                                            setNickname("");
                                                            setStage(0);
                                                            break;
                                                        case 5:
                                                            snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Данный никнейм уже занят.' ]);
                                                            setNickname("");
                                                            setStage(0);
                                                            break;
                                                        default:
                                                            snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Произошла неизвестная ошибка.' ]);
                                                            break;
                                                    }
                                                    popout(null);
                                                } else {
                                                    localStorage.setItem('access_token', result?.response);
                                                    API.usersGet().then(result => {
                                                        localStorage.setItem('user_profile', JSON.stringify(result?.response));

                                                        transition('/profile');
                                                        popout(null);
                                                        snackBar(true, [ <Icon28DoneOutline fill="green"/>, "Вы успешно зарегистрировались!" ]);
                                                    }).catch(e => {
                                                        console.warn("⚠️ Не удалось получить профиль пользователя: ", e);
                                                    });
                                                }
                                            }).catch(e => {
                                                popout(null);
                                                snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Произошла неизвестная критическая ошибка...' ]);

                                                console.log("⚠️ Ошибка при регистрации: ", e);
                                            })
                                        }}
                                    >
                                        Зарегистрироваться
                                    </Button>
                                </FormItem>
                            </div>
                        </FormLayout>
                    </div>
                </div>
            </Group>
            {!useCheckMobileScreen() && <PFooter after={`© ${new Date().getFullYear()}`}/>}
            {snackBar()}
        </Panel>
    );
}

Register.prototype = {
    nav: PropTypes.string.isRequired,
    snackBar: PropTypes.func.isRequired,
    popout: PropTypes.func.isRequired
}