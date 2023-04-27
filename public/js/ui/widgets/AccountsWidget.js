/** Класс AccountsWidget управляет блоком отображения счетов в боковой колонке */
class AccountsWidget {
  /** Устанавливает текущий элемент в свойство element Регистрирует обработчики событий с помощью AccountsWidget.registerEvents() Вызывает AccountsWidget.update() для получения списка счетов и последующего отображения Если переданный элемент не существует, необходимо выкинуть ошибку. */
  constructor( element ) {
    if (!element) {
      throw new Error('Переданный элемент не существует');
    }
    this.element = element;
    this.update();
    this.registerEvents();

  }

  /** При нажатии на .create-account открывает окно #modal-new-account для создания нового счёта При нажатии на один из существующих счетов (которые отображены в боковой колонке), вызывает AccountsWidget.onSelectAccount() */
  registerEvents() {
    let createAccount = this.element.querySelector('.create-account');
    createAccount.addEventListener('click', () => {
      App.getModal('createAccount').open()
    })
  }

  /** Метод доступен только авторизованным пользователям (User.current()). Если пользователь авторизован, необходимо получить список счетов через Account.list(). При успешном ответе необходимо очистить список ранее отображённых счетов через AccountsWidget.clear(). Отображает список полученных счетов с помощью метода renderItem() */
  update() {
    let user = User.current();
    if (user) {
      Account.list(null, (error, result) => {
        if (result) {
          this.clear();
          this.renderItem(result.data);
          let accounts = this.element.querySelectorAll('.account');
          for (let account of accounts) {
            account.addEventListener('click', () => {
              this.onSelectAccount(account);
            })
          }
        }
      });
    }
    
  }

  /** Очищает список ранее отображённых счетов. Для этого необходимо удалять все элементы .account в боковой колонке */
  clear() {
    let accounts = this.element.querySelectorAll('.account');
    for (let account of accounts) {
      account.remove();
    }
  }

  /** Срабатывает в момент выбора счёта Устанавливает текущему выбранному элементу счёта класс .active. Удаляет ранее выбранному элементу счёта класс .active. Вызывает App.showPage( 'transactions', { account_id: id_счёта }); */
  onSelectAccount( element ) {
    let lastActive = this.element.querySelector('.active');
    if (lastActive) lastActive.classList.remove('active');
    
    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });
  }

  /** Возвращает HTML-код счёта для последующего отображения в боковой колонке. item - объект с данными о счёте */
  getAccountHTML(item){
    return `
    <li class="account" data-id="${item.id}">
      <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} ₽</span>
      </a>
    </li>
    `
  }

  /** Получает массив с информацией о счетах. Отображает полученный с помощью метода AccountsWidget.getAccountHTML HTML-код элемента и добавляет его внутрь элемента виджета */
  renderItem(data){
    /**  data = [{
       "id": 35,
       "name": "Сбербанк",
       "sum": 2396.30
     }, {
       "id": 35,
       "name": "Сбербанк",
       "sum": 2396.30
     }]*/
    for (let account of data) {
      let htmlCode = this.getAccountHTML(account);
      this.element.insertAdjacentHTML('beforeend', htmlCode);
    }
  }
}