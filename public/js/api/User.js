/** Класс this управляет авторизацией, выходом и регистрацией пользователя из приложения. Имеет свойство URL, равное '/user'.*/
class User {
  static URL = '/user';
  /** Устанавливает текущего пользователя в локальном хранилище. */
  static setCurrent(user) {
     localStorage.setItem('user', JSON.stringify(user));
  }

  /** Удаляет информацию об авторизованном пользователе из локального хранилища. */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /** Возвращает текущего авторизованного пользователя из локального хранилища */
  static current() {
    return localStorage.getItem('user');
  }

  /** Получает информацию о текущем авторизованном пользователе. */
  static fetch(callback) {
    createRequest({
      url: this.URL + '/current', 
      method: 'GET', 
      callback: (error, response) => {
        if (response && response.success) {
          this.setCurrent(response.user)
          callback(null, response)
        } else {
          this.unsetCurrent();
          callback(response, null);
        }
      }
    })
  }

  /** Производит попытку авторизации. После успешной авторизации необходимо сохранить пользователя через метод this.setCurrent. */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /** Производит попытку регистрации пользователя. После успешной авторизации необходимо сохранить пользователя через метод this.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register', 
      method: 'POST', 
      callback: (error, response) => {
      if (response && response.success) {
        this.setCurrent(response.user)
        callback(null, response)
      } else {
        callback(response, null)
      };
    }})
  }

  /** Производит выход из приложения. После успешного выхода необходимо вызвать метод this.unsetCurrent */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout', 
      method: 'POST', 
      callback: (error, response) => {
      if (response && response.success) {
        this.unsetCurrent()
        callback(null, response)
      } else {
        callback(response, null);
      }
    }})
  }
}

