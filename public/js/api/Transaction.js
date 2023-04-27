/** Класс Transaction наследуется от Entity. Управляет счетами пользователя. Имеет свойство URL со значением '/transaction'*/

class Transaction extends Entity {
    static URL = '/transaction';

    static list(accountId, callback) {
        createRequest({url: this.URL + '?account_id=' + accountId, method: 'GET', callback: callback})
    }
}

