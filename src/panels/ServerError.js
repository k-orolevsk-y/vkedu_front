import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Panel,
    Button,
    Placeholder
} from "@vkontakte/vkui";
import {
    Icon56ErrorTriangleOutline
} from "@vkontakte/icons";

export const ServerError = ({ nav, popout }) => {

    useEffect(() => {
        popout(null);
    }, []);

    return (
        <Panel
            nav={nav}
        >
            <Placeholder
                header="Ошибка!"
                icon={<Icon56ErrorTriangleOutline fill="orange"/>}
                action={
                    <Button
                        size="l"
                        mode="outline"
                        onClick={() => {
                            transition('/');
                        }}
                        stretched={true}
                    >
                        Перейти на главную страницу
                    </Button>
                }
                stretched={true}
            >
                Серверу не удалось обработать запрос.<br/>Попробуйте чуть позже.
            </Placeholder>
        </Panel>
    );
}

ServerError.prototype = {
    nav: PropTypes.string.isRequired,
    popout: PropTypes.func.isRequired
};