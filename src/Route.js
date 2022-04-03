import React, {useEffect, useState} from "react";
import {Epic, View, transition, Match} from "@unexp/router";
import {
    AppRoot,
    Snackbar,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem
} from "@vkontakte/vkui";
import {
    Icon28Newsfeed,
    Icon28Profile,
    Icon28WriteSquareOutline
} from "@vkontakte/icons";
import {
    Auth,
    LimitsError,
    NetworkError,
    New,
    Newsfeed,
    Profile,
    ProfileEdit,
    Register,
    ServerError
} from "./panels";

import API from "./assets/API";
import useCheckMobileScreen from "./assets/useCheckMobileScreen";

export const Route = () => {
    const [path, setPath] = useState(new URL(document.location.href).pathname.split(/(?=\/)/));
    const [snackBar, setSnackBar] = useState(null);
    const [popout, setPopout] = useState(null);

    useEffect(() => {
        const locFunctions = (path) => {
            if(!localStorage.getItem('access_token') && path[0] !== "/auth") { // Если пользователь не авторизован
                return setTimeout(() => {
                    transition('/auth')
                }, 10);
            } else if(!!localStorage.getItem('access_token') && !localStorage.getItem('user_profile')) { // Если нет "закешировашного" профиля пользователя
                API.usersGet().then(result => {
                    if(!result?.ok) return;

                    localStorage.setItem('user_profile', JSON.stringify(result?.response));
                }).catch(e => {
                    console.warn("⚠️ Не удалось получить профиль пользователя: ", e);
                })
                return true;
            }
        }

        window.addEventListener('popstate', () => { // Следим за изменением URL
            const tmpPath = new URL(document.location.href).pathname.split(/(?=\/)/);
            locFunctions(tmpPath);

            setPath(tmpPath);
        });
        locFunctions(path);
    }, []);

    const snackBarFunction = (change = false, data = null) => {
        if(!change) {
            return snackBar;
        } else if(data === null || !Array.isArray(data) || data?.length < 2 ) {
            return setSnackBar(null);
        }

        setSnackBar(
            <Snackbar
                before={data[0]}
                onClose={() => setSnackBar(null)}
            >
                {data[1]}
            </Snackbar>
        )
    }


    const needTabbar = path[0] !== "/auth" && path[0] !== '/service';
    return (
       <Match>
           <AppRoot>
               <SplitLayout
                    popout={popout}
               >
                   <SplitCol
                        width="100%"
                        height="100%"
                        animate={useCheckMobileScreen()}
                   >
                       <Epic
                           className={!needTabbar ? "vkuiSnackbar--fix" : ""}
                           tabbar={!useCheckMobileScreen() || !needTabbar ? null :
                               <Tabbar>
                                   <TabbarItem
                                       text="Лента"
                                       selected={path[0] == "/"}
                                       onClick={() => {
                                           transition('/');
                                       }}
                                   >
                                       <Icon28Newsfeed/>
                                   </TabbarItem>
                                   <TabbarItem
                                       onClick={() => {
                                           transition('/new');
                                       }}
                                   >
                                       <Icon28WriteSquareOutline fill="#2688eb"/>
                                   </TabbarItem>
                                   <TabbarItem
                                       text="Профиль"
                                       selected={path[0] == "/profile"}
                                       onClick={() => {
                                           window.location.href = "/profile"; // Такой редирект из-за особенностей роутера...
                                       }}
                                   >
                                       <Icon28Profile/>
                                   </TabbarItem>
                               </Tabbar>
                           }
                       >
                           <View nav="/">
                               <Newsfeed
                                   nav="/"
                                   snackBar={snackBarFunction}
                                   popout={setPopout}
                               />
                           </View>
                           <View nav="/new">
                               <New
                                   nav="/"
                                   snackBar={snackBarFunction}
                                   popout={setPopout}
                               />
                           </View>
                           <View nav="/profile">
                               <Profile
                                   nav="/"
                                   snackBar={snackBarFunction}
                                   popout={setPopout}
                               />
                                <ProfileEdit
                                    nav="/edit"
                                    snackBar={snackBarFunction}
                                    popout={setPopout}
                                />
                           </View>
                           <View nav="/auth">
                               <Auth nav="/" snackBar={snackBarFunction} popout={setPopout}/>
                               <Register nav="/register" snackBar={snackBarFunction} popout={setPopout}/>
                           </View>
                           <View nav="/service">
                               <NetworkError nav="/network_error" snackBar={snackBarFunction} popout={setPopout}/>
                               <ServerError nav="/server_error" popout={setPopout}/>
                               <LimitsError nav="/limits_error" popout={setPopout}/>
                           </View>
                       </Epic>
                   </SplitCol>
               </SplitLayout>
           </AppRoot>
       </Match>
    )
}