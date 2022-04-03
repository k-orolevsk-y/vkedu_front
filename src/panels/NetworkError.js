import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Panel,
    Placeholder
} from "@vkontakte/vkui";
import {
    Icon28Flash,
    Icon28DoneOutline,
    Icon56GlobeCrossOutline
} from "@vkontakte/icons";

import API from "../assets/API";

export const NetworkError = ({ nav, snackBar, popout }) => {
    useEffect(() => {
        popout(null);
        snackBar(true, [ <Icon28Flash fill="var(--accent)"/>, 'Когда интернет появиться, вы автоматически будете отправлены на главную страницу.' ]);

        // Проверяем, появилось ли соединение с сервером...
        const intervalId = setInterval(async () => {
           if(await API.checkConnection()) {
               clearInterval(intervalId);
               snackBar(true, [ <Icon28DoneOutline fill="green"/>, "Поздравляем, вы снова вернулись в интернет!" ]);
               setTimeout(() => {
                   transition('/');
                   snackBar(true);
               }, 2000);
           }
        }, 1500);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    return(
        <Panel
            nav={nav}
        >
            <Placeholder
                header="Упс"
                icon={<Icon56GlobeCrossOutline fill="red"/>}
                stretched={true}
            >
                Нам не удалось соединиться с сервером.<br/>Возможно пропало интернет-соединение.
            </Placeholder>

            {snackBar()}
        </Panel>
    )
}

NetworkError.prototype = {
    nav: PropTypes.string.isRequired,
    snackBar: PropTypes.func.isRequired,
    popout: PropTypes.func.isRequired
};