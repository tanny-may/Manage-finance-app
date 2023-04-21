/** Основная функция для совершения запросов на сервер.*/

const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    
    let formData;
    if (options.method !== 'GET') {
        formData = new FormData;

        for (let key in options.data) {
            formData.append(key, options.data[key]);
        } 
    }

    xhr.responseType = 'json';
    xhr.onload = () => {
        console.log('status:', xhr.status);
        if (xhr.status >= 400) {
            options.callback(xhr.response, null)
        } else {
            options.callback(null, xhr.response);
        }
    }
    console.log('Send request', xhr, 'to', options.url);
    xhr.send(formData);
};
