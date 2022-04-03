import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {transition} from "@unexp/router";
import {
    Button,
    Panel,
    Placeholder
} from "@vkontakte/vkui";
import {
    Icon56SettingsOutline
} from "@vkontakte/icons";

export const LimitsError = ({ nav, popout }) => {

    useEffect(() => {
        popout(null);
    }, []);

    return (
        <Panel
            nav={nav}
        >
            <Placeholder
                header="Так-так-так!"
                icon={<Icon56SettingsOutline fill="red"/>}
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
                От вас поступает слишком много однотипных запросов<br/>и наш сервер забыл тревогу!<br/>Немного подождите и возвращайтесь к нам на сайт.
            </Placeholder>
        </Panel>
    )
}

LimitsError.prototype = {
    nav: PropTypes.string.isRequired,
    popout: PropTypes.func.isRequired
};