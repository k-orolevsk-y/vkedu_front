import React, {useReducer, useState} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Avatar,
    Button,
    File,
    FormItem,
    FormLayout,
    Group,
    HorizontalCell,
    HorizontalScroll,
    Panel,
    ScreenSpinner,
    Subhead,
    Textarea
} from "@vkontakte/vkui";
import {
    Icon24CameraOutline,
    Icon24WriteOutline,
    Icon28CancelOutline,
    Icon28DoneOutline,
    Icon36CancelOutline
} from "@vkontakte/icons";
import {PHeader} from "../assets/PHeader";
import "../styles/New.css";

import API from "../assets/API";
import useCheckMobileScreen from "../assets/useCheckMobileScreen";

export const New = ({ nav, snackBar, popout }) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState({});
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    return (
        <Panel
            nav={nav}
        >
            <PHeader>
                Создание поста
            </PHeader>
            <Group
                className="New_post"
            >
                <FormLayout>
                    {!useCheckMobileScreen() &&
                    <FormItem>
                        <Subhead weight="2">Создание нового поста️</Subhead>
                    </FormItem>
                    }
                    <FormItem>
                        <Textarea
                            rows={200}
                            maxLength={4096}
                            placeholder="Сегодня утром я..."
                            value={text}
                            onChange={e => {
                                setText(e?.target?.value);
                            }}
                        />
                    </FormItem>
                    {Object.keys(files).length > 0 &&
                    <HorizontalScroll>
                        <div
                            className="New_post_files"
                        >
                            {
                                Object.entries(files).map(file => {
                                    return(
                                        <HorizontalCell
                                            key={file[0]}
                                            onClick={() => {
                                                // Обновляем состояния, если это не сделать, то в объекте будут не все файлы
                                                forceUpdate();

                                                const newFiles = files;
                                                delete newFiles[file[0]];
                                                setFiles(newFiles);
                                            }}
                                            className="New_post_files_remove"
                                        >
                                            <div className="New_post_file_remove">
                                                <Icon36CancelOutline width={92} height={92} fill="white"/>
                                            </div>
                                            <Avatar mode="app" src={file[1]} className="New_post_file_img" shadow={false}/>
                                        </HorizontalCell>
                                    )
                                })
                            }
                        </div>
                    </HorizontalScroll>
                    }
                    {Object.keys(files).length >= 10 && <span className="New_post_limit_files">Вы достигли ограничения в 10 фотографий.</span>}
                    <div
                        className="New_post_buttons"
                    >
                        <FormItem>
                            <File
                                before={<Icon24CameraOutline/>}
                                controlSize="m"
                                mode="secondary"
                                accept="image/png, image/gif, image/jpeg"
                                multiple
                                onChange={e => {
                                    e.persist();
                                    popout(<ScreenSpinner/>);

                                    API.filesUpload(e.target.files)
                                        .then(result => {
                                            if(!result.ok) {
                                                popout(null);
                                                return;
                                            }

                                            let photoIds = [];
                                            result?.response?.map(photo => {
                                                if(photo === false || files[photo] === undefined) {
                                                    if((photoIds.length + Object.keys(files).length) < 10) {
                                                        photoIds.push(photo);
                                                    }
                                                }
                                            })


                                            if(photoIds === []) {
                                                popout(null);
                                                return;
                                            }

                                            photoIds.map(photo => {
                                                if(!photo) return;

                                                const newFiles = files;
                                                newFiles[photo] = API.filesGet(photo);
                                                setFiles(newFiles);

                                                popout(null);
                                                forceUpdate();
                                            })
                                        });
                                }}
                                disabled={Object.keys(files).length >= 10}
                            />
                        </FormItem>
                        <FormItem>
                            <Button
                                size="m"
                                mode="outline"
                                before={<Icon24WriteOutline/>}
                                disabled={text.length < 6 || text.length > 4096}
                                onClick={() => {
                                    popout(<ScreenSpinner/>);
                                    API.newsfeedAdd(text, Object.keys(files).join(',')).then(result => {
                                        popout(null);
                                        if(result === undefined) return;

                                        if(!result?.ok) {
                                            const error_code = result?.error?.error_code;
                                            switch(error_code) {
                                                case 1:
                                                    snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Введён невалидный текст поста.' ]);
                                                    break;
                                                default:
                                                    snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Произошла неизвестная ошибка.' ]);
                                                    break;
                                            }
                                        } else {
                                            snackBar(true, [ <Icon28DoneOutline fill="green"/>, "Пост был успешно выложен!" ])
                                            transition('/profile');
                                        }
                                    }).catch(e => {
                                        console.log("⚠️ Произошла ошибка при создании поста: ", e);

                                        snackBar(true, [ <Icon28CancelOutline fill="red"/>, 'Произошла неизвестная критическая ошибка...' ]);
                                        popout(null);
                                    })
                                }}
                                stretched={true}
                            >
                                Выложить
                            </Button>
                        </FormItem>
                    </div>
                </FormLayout>
            </Group>
            {snackBar()}
        </Panel>
    )
}

New.prototype = {
    nav: PropTypes.string.isRequired,
    snackBar: PropTypes.func.isRequired,
    popout: PropTypes.func.isRequired
}