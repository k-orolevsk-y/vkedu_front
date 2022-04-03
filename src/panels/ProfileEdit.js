import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Avatar,
    Button,
    FormItem,
    FormLayout,
    Group,
    Input,
    Panel,
    ScreenSpinner
} from "@vkontakte/vkui";
import {
    Icon28DoneOutline,
    Icon28CancelOutline,
    Icon56DownloadOutline,
    Icon28DownloadCancelOutline
} from "@vkontakte/icons";
import {PHeader} from "../assets/PHeader";

import "../styles/ProfileEdit.css";
import API from "../assets/API";

export const ProfileEdit = ({ nav, snackBar, popout }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_profile') ?? "{}"))
    const [nickname, setNickname] = useState(user?.nickname);

    useEffect(() => {
        if(Object.keys(user).length < 1) {
            popout(<ScreenSpinner/>);
            API.usersGet().then(result => {
                if(result === undefined) return;

                popout(null);
                if(!result.ok) {
                    throw new Error(result?.error?.error_code);
                } else {
                    setUser(result?.response);
                }
            }).catch(e => {
                console.log('⚠️ Не удалось получить профиль для редактирования: ', e);
                transition('/profile');
            })
        }
    }, [])

    return (
        <Panel
            nav={nav}
        >
            <PHeader
                needBackButton={true}
            >
                Профиль
            </PHeader>
            <Group
                style={{
                    display: `${Object.keys(user).length < 1 ? 'none' : 'block'}`
                }}
            >
                <FormLayout
                    className="ProfileEdit_form"
                >
                    <FormItem>
                        <Avatar
                            overlayIcon={
                                <Icon56DownloadOutline fill="var(--accent)"/>
                            }
                            className="ProfileEdit_form_center"
                            size={128}
                            src={user?.photo}
                            onClick={() => {
                                document.getElementById('button_upload_image').click();
                            }}
                        />
                        <input
                            id="button_upload_image"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={e => {
                                e.persist();
                                popout(<ScreenSpinner/>);

                                API.filesUpload(e.target.files).then(result => {
                                    if(!result?.ok) {
                                        throw new Error(result?.error?.error_msg);
                                    } else {
                                        const photo_id = result?.response[0];
                                        API.accountSetAvatar(photo_id).then(result_set => {
                                            if(result === undefined) return;

                                            if(!result_set.ok) {
                                                throw new Error(result_set?.error?.error_msg);
                                            } else {
                                                setUser(result_set?.response);
                                                localStorage.setItem("user_profile", JSON.stringify(result_set?.response));

                                                popout(null);
                                                snackBar(true, [ <Icon28DoneOutline fill="green"/>, "Фото профиля было успешно изменано!" ]);
                                            }
                                        })
                                    }
                                }).catch(e => {
                                    console.log("⚠️ Фотография не была загружена на сервер: ", e);

                                    popout(null);
                                    snackBar(true, [ <Icon28DownloadCancelOutline fill="red"/>, 'Не удалось загрузить фото.' ])
                                })
                            }}
                        />
                    </FormItem>
                    <FormItem
                        top="Никнейм"
                    >
                        <Input
                            placeholder="Никнейм"
                            value={nickname}
                            onChange={e => {
                                setNickname(e?.target?.value?.replace(' ', ''))
                            }}
                        />
                    </FormItem>

                    <FormItem>
                        <Button
                            size="l"
                            mode="commerce"
                            disabled={!/^[A-Za-z][A-Za-z0-9_]{5,14}$/.test(nickname) || nickname == user?.nickname} // Thanks: https://stackoverflow.com/a/11214496
                            onClick={() => {
                                API.accountEdit(nickname).then(result => {
                                    if(result === undefined) return;

                                    popout(null);
                                    if(!result?.ok) {
                                        const error_code = result?.error?.error_code;
                                        switch(error_code) {
                                            case 1:
                                                snackBar(true, <Icon28CancelOutline fill="red"/>, "Введён невалидный никнейм.");
                                                break;
                                            case 2:
                                                snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Данный никнейм уже занят.' ]);
                                                break;
                                            default:
                                                snackBar(true, <Icon28CancelOutline fill="red"/>, "Произошла неизвестная ошибка.");
                                                break;
                                        }
                                    } else {
                                        localStorage.setItem("user_profile", JSON.stringify(result?.response));

                                        snackBar(true, [ <Icon28DoneOutline fill="green"/>, 'Профиль успешно изменён!' ]);
                                        transition('/profile');
                                    }
                                }).catch(e => {
                                    popout(null);
                                    snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Произошла неизвестная критическая ошибка...' ]);

                                    console.log("⚠️ Ошибка при редактировании профиля: ", e);
                                })
                            }}
                            stretched={true}
                        >
                            Сохранить
                        </Button>
                    </FormItem>
                </FormLayout>
            </Group>

            {snackBar()}
        </Panel>
    );
}

ProfileEdit.prototype = {
    nav: PropTypes.string.isRequired,
    snackBar: PropTypes.func.isRequired,
    popout: PropTypes.func.isRequired
}