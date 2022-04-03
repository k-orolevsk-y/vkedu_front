import React, {useReducer} from "react";
import {transition} from "@unexp/router";
import {
    Avatar,
    Button,
    Group,
    HorizontalCell,
    HorizontalScroll,
    SimpleCell,
    Link,
    Text
} from "@vkontakte/vkui";
import {
    Icon28CancelOutline,
    Icon28LikeCircleFillRed,
    Icon28LikeOutline,
    Icon28ViewOutline
} from "@vkontakte/icons";
import {getRandomInt} from "@vkontakte/vkjs";

import "../styles/Post.css";

import API from "./API";
import useCheckMobileScreen from "./useCheckMobileScreen";

export const Post = ({ profile, item, snackBar }) => {
    const [,forceUpdate] = useReducer(x => x + 1, 0);

    return (
        <Group
            className="Post"
        >
            <SimpleCell
                before={<Avatar src={profile?.photo}/>}
                description={API.genDate(item?.time, true)}
                onClick={() => {
                    transition(`/profile?id=${profile?.id}`)
                }}
                className="Post_profile"
            >
                @{profile?.nickname}
            </SimpleCell>
            <div
                style={{ margin: "5px 18px 15px 18px" }}
            >
                <Text>
                    {
                        item?.text?.split(" ")
                        .map(part =>
                            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
                        .test(part) ? <Link key={getRandomInt()} href={part} target="_blank">{part} </Link> : part + " ")
                    }
                </Text>
                {item?.files?.length > 0 &&
                <HorizontalScroll>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: `${item?.images?.length < 5 && !useCheckMobileScreen() ? 'center' : 'normal'}`
                        }}
                    >
                        {item?.files?.map((image, key_image) => (
                            <HorizontalCell
                                key={key_image}
                                size="l"
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = image;
                                    a.target = '_blank';

                                    a.dispatchEvent(new window.MouseEvent('click', {
                                        view: window,
                                        bubbles: true,
                                        cancelable: true
                                    }));
                                }}
                            >
                                <Avatar
                                    mode="image"
                                    size={256}
                                    className="Post_image"
                                    src={image}
                                />
                            </HorizontalCell>
                        ))}
                    </div>
                </HorizontalScroll>
                }
            </div>
            <SimpleCell
                before={
                    <Button
                        id={`Button_like_${item?.id}`}
                        mode="tertiary"
                        className={`${!item?.is_liked ? "Post_button_like" : "Post_button_like Post_liked"}`}
                        before={!item?.is_liked ? <Icon28LikeOutline/> : <Icon28LikeCircleFillRed/>}
                        onClick={() => {
                            // Через ID элемента 100% выставляется класс с анимацией, по сравнению с e?.target?.classList
                            let elem = document.getElementById(`Button_like_${item?.id}`);

                            API.newsfeedLike(item?.id).then(result => {
                                if(result === undefined) return;

                                if(!result?.ok) {
                                    return snackBar(true, [ <Icon28CancelOutline fill="red"/>, "Не удалось поставить лайк, попробуйте ещё раз." ])
                                }

                                item.is_liked = result?.response;
                                if(result?.response) {
                                    item.likes += 1;

                                    setTimeout(() => { // Такая конструкция из-за особенностей VKUI
                                        elem.classList.add('Post_liked_animation');
                                        setTimeout(() => {
                                            elem.classList.remove('Post_liked_animation');
                                        }, 500);
                                    }, 100);
                                } else {
                                    item.likes -= 1;

                                    setTimeout(() => { // Такая конструкция из-за особенностей VKUI
                                        elem.classList.add('Post_unliked_animation');
                                        setTimeout(() => {
                                            elem.classList.remove('Post_unliked_animation');
                                        }, 500);
                                    }, 100);
                                }

                                forceUpdate();
                            })
                        }}
                    >
                        &nbsp;{item?.likes}
                    </Button>
                }
                after={
                    <div
                        className="Post_views"
                    >
                        <Icon28ViewOutline/>
                        <span>
                            {item?.views}
                        </span>
                    </div>
                }
                disabled={true}
            />
        </Group>
    );
}