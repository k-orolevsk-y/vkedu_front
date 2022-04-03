import {Separator} from "@vkontakte/vkui";

export const PFooter = ({ before, after, children }) => (
    <div
        className="PanelFooter"
    >
        <Separator/>
        <div className="PanelFooter__Before">
            {before}
        </div>

        <div className="PanelFooter__center">
            {children}
        </div>

        <div className="PanelFooter__after">
            {after}
        </div>
    </div>
);