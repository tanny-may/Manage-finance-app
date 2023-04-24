/** Класс Sidebar отвечает за работу боковой колонки:кнопки скрытия/показа колонки в мобильной версии сайта и за кнопки меню*/
class Sidebar {
  /** Запускает initAuthLinks и initToggleButton*/
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /** Отвечает за скрытие/показа боковой колонки:переключает два класса для body: sidebar-open и sidebar-collapse при нажатии на кнопку .sidebar-toggle*/
  static initToggleButton() {
    let body = document.querySelector('body');
    let sidebarToggle = document.querySelector('.sidebar-toggle');


    sidebarToggle.addEventListener('click', function() {
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    })
  }

  /** При нажатии на кнопку входа, показывает окно входа (через найденное в App.getModal) При нажатии на кнопку регистрации показывает окно регистрации При нажатии на кнопку выхода вызывает User.logout и по успешному выходу устанавливает App.setState( 'init' ) */
  static initAuthLinks() {
    let login = document.querySelector('.menu-item_login');

    login.addEventListener('click', () => {
      App.getModal('login').open()
    })

    let register = document.querySelector('.menu-item_register');
    register.addEventListener('click', () => {
      App.getModal('register').open();
    })

    let logout = document.querySelector('.menu-item_logout');
    logout.addEventListener('click', () => {
      User.logout((error, response) => {
        if (!error) App.setState('init')
      })
    })
  }
}