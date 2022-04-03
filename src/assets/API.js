import axios from "axios";
import {transition} from "@unexp/router";

class API {
    static URL_HOST = "https://vkedu.korolevsky.me/api/";

    static async accountAuth(login, password) {
        return await this.request('account.auth', {login, password});
    }

    static async accountEdit(nickname) {
        return await this.request('account.edit', {nickname});
    }

    static async accountExitSession() {
        return await this.request('account.exitSession');
    }

    static async accountRegister(login, password, nickname) {
        return await this.request('account.register', {login, password, nickname})
    }

    static async accountSetAvatar(file_id) {
        return await this.request('account.setAvatar', { file_id });
    }

    static filesGet(id) {
        const access_token = localStorage.getItem('access_token');
        if(!access_token) {
            return null;
        }

        return this.URL_HOST + `files.get?access_token=${access_token}&id=${id}`;
    }

    static async filesUpload(files) {
        const access_token = localStorage.getItem('access_token');
        if(!access_token) {
            return null;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            formData.append(
                `file${i}`,
                file
            );
        }

        return await axios.post(
            this.URL_HOST + `files.upload?access_token=${access_token}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        ).then(response => {
            return response.data;
        }).catch(e => {
            console.log(`😔 Ошибка при загрузке файлов на API: ${e?.toJSON().message}`)
            if(e?.toJSON().message === 'Network Error'){
                transition("/service/network_error")
            }
        })
    }

    static async newsfeedAdd(text, files = "") {
        return await this.request('newsfeed.add', {text, files})
    }

    static async newsfeedGet(user_id) {
        if(!!user_id) {
            return await this.request('newsfeed.get', { user_id });
        } else {
            return await this.request('newsfeed.get');
        }
    }

    static async newsfeedLike(post_id) {
        return await this.request('newsfeed.like', {post_id});
    }

    static async usersGet(id = undefined) {
        if(!id) {
            return await this.request('users.get');
        } else {
            return await this.request('users.get', { id })
        }
    }

    static async request(method, params = {}) {
        const access_token = localStorage.getItem('access_token');
        if(!!access_token) {
            params['access_token'] = access_token;
        }

        return await axios({
            url: this.URL_HOST + method.toString(),
            method: "POST",
            params
        }).then(response => {
            const data = response.data;
            if(!data?.ok) {
                const error_code = data?.error?.error_code;
                switch(error_code) {
                    case 401:
                        localStorage.clear();
                        transition('/auth');

                        break;
                    case 429:
                        transition('/service/limits_error');
                        break;
                }

                return data;
            } else {
                return data;
            }
        }).catch(e => {
            console.log(`😔 Ошибка при работе с API: ${e?.toJSON().message}`)
            if(e?.toJSON().message === 'Network Error'){
                transition("/service/network_error")
            } else if(e?.response?.status === 500) {
                transition("/service/server_error");
            }
        })
    }

    static async checkConnection(domain) {
        return await axios({
            url: domain ?? API.URL_HOST,
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    static genDate(time, need_min_and_secs = false) {
        const date = new Date(time*1000);
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'ноября', 'декабря',];


        let dateText;
        if(need_min_and_secs) {
            dateText = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " в " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
        } else {
            dateText = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        }

        return dateText;
    }

    static pluralForm(number, titles) {
        let cases = [2, 0, 1, 1, 1, 2];
        return number.toString() + " " + (titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]).toString();
    }
}

export default API;