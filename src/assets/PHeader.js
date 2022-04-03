import React, {useState} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Avatar,
    PanelHeader,
    PanelHeaderContent,
    PanelHeaderContext,
    SimpleCell,
    Spacing,
    List, PanelHeaderBack
} from "@vkontakte/vkui";
import {
    Icon16Dropdown,
    Icon28Newsfeed,
    Icon28ArrowRightOutline,
    Icon28DoorArrowRightOutline
} from "@vkontakte/icons";

import API from "./API";
import useCheckMobileScreen from "./useCheckMobileScreen";

export const PHeader = ({ children, needBackButton, ...restProps }) => {
    const [user,] = useState(!localStorage.getItem('user_profile') ? null : JSON.parse(localStorage.getItem('user_profile')))
    const [contextOpened, setContextOpened] = useState(false);

    const toggleContext = () => {
        setTimeout(() => {
            setContextOpened(!contextOpened);
        }, 5); // Фиксит автоматическое закрытие контекста при его открытии.
    }

    return (!useCheckMobileScreen() ?
            <>
                <PanelHeader
                    shadow={true}
                    {...restProps}
                >
                    <div className="PanelHeader_custom">
                    <span className="PanelHeader_custom_text">
                        {children}
                    </span>
                        <PanelHeaderContent
                            aside={
                                <Icon16Dropdown
                                    style={{transform: `rotate(${contextOpened ? "180deg" : "0"})`}}
                                />
                            }
                            onClick={toggleContext}
                        >
                                Меню
                        </PanelHeaderContent>
                    </div>
                </PanelHeader>
                <PanelHeaderContext
                    opened={contextOpened}
                    onClose={toggleContext}
                >
                    <List>
                        <SimpleCell
                            before={user && <Avatar src={user?.photo}/>}
                            after={<Icon28ArrowRightOutline/>}
                            description={user && "Перейти в профиль"}
                            onClick={() => {
                                window.location.href = "/profile"; // Такой редирект из-за особенностей роутера...
                            }}
                            className="PanelHeader_custom_profile"
                        >
                            {user ? `@${user?.nickname}` : `Перейти в профиль`}
                        </SimpleCell>
                        <Spacing/>
                        <SimpleCell
                            before={<Icon28Newsfeed/>}
                            onClick={() => {
                                transition("/");
                            }}
                        >
                            Лента
                        </SimpleCell>
                        <Spacing/>
                        <SimpleCell
                            before={<Icon28DoorArrowRightOutline/>}
                            onClick={() => {
                                API.accountExitSession();
                                localStorage.clear();

                                transition('/auth');
                            }}
                        >
                            Выйти
                        </SimpleCell>
                    </List>
                </PanelHeaderContext>
            </>
            :
            <PanelHeader
                left={needBackButton &&
                    <PanelHeaderBack
                        onClick={() => {
                            transition(-1);
                        }}
                    />
                }
                shadow={true}
                {...restProps}
            >
                {children}
            </PanelHeader>
    );
}

PHeader.prototype = {
    children: PropTypes.element.isRequired,
    needBackButton: PropTypes.bool
};