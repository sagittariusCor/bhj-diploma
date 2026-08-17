/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    let url = options.url;

    const method = options.method || 'GET';
    const data = options.data || {};
    const callback = options.callback || (() => {});

    if (method === 'GET') {
        const params = new URLSearchParams(data);
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    xhr.open(method, url);

    if (method !== 'GET') {
        const formData = new FormData();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }

        xhr.send(formData);
    }else {
        xhr.send();
    }

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE) {
            let err = null;
            let response = null;

            if (xhr.status === 200) {
                response = xhr.response;
                if (response && response.success === false) {
                    err = response.error || 'Произошла ошибка на сервере';
                }
            }else {
                err = `Произошла ошибка при выполнении запроса. Статус: ${xhr.status} ${xhr.statusText}`;
            }
             callback(err, response);
        }
    });
    
};
