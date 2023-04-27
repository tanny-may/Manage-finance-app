/** Класс TransactionsPage управляет страницей отображения доходов и расходов конкретного счёта */
class TransactionsPage {
  /** Если переданный элемент не существует, необходимо выкинуть ошибку. Сохраняет переданный элемент и регистрирует события через registerEvents() */
  constructor( element ) {
    if (!element) {
      throw new Error('Переданный элемент не существует');
    }
    this.element = element;
    this.registerEvents();
  }

  /** Вызывает метод render для отрисовки страницы */
  update() {
    this.render(this.lastOptions);
  }

  /** Отслеживает нажатие на кнопку удаления транзакции и удаления самого счёта. Внутри обработчика пользуйтесь методами TransactionsPage.removeTransaction и TransactionsPage.removeAccount соответственно */
  registerEvents() {
    let removeAccountBtn = this.element.querySelector('.remove-account');
    removeAccountBtn.addEventListener('click', () => {
      this.removeAccount();
    })

    let removeTransactionBtns = this.element.querySelectorAll('.transaction__remove');
    for (let btn of removeTransactionBtns) {
      btn.addEventListener('click', () => {
        this.removeTransaction(btn.dataset.id);
       }) 
    }
    
  }

  /** Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm()) Если пользователь согласен удалить счёт, вызовите Account.remove, а также TransactionsPage.clear с пустыми данными для того, чтобы очистить страницу. По успешному удалению необходимо вызвать метод App.updateWidgets(), либо обновляйте только виджет со счетами для обновления приложения */
  removeAccount() {
    if (this.lastOptions && confirm('Вы действительно хотите удалить счёт?')) { 
      Account.remove({id: this.lastOptions.id}, (error, success) => {
        if (success) {
          this.clear();
          App.updateWidgets() 
        }
      })
    }
  }

  /** Удаляет транзакцию (доход или расход). Требует подтверждеия действия (с помощью confirm()). По удалению транзакции вызовите метод App.update(), либо обновляйте текущую страницу (метод update) и виджет со счетами */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({id: id}, (error, success) => {
        if (success) { 
          App.update()
        }
      })
    }
  }

  /** С помощью Account.get() получает название счёта и отображает его через TransactionsPage.renderTitle. Получает список Transaction.list и полученные данные передаёт в TransactionsPage.renderTransactions() */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get({id: options['account_id']}, (error, response) => {
        if (response) {
          this.renderTitle(response['name'])
        }
      })
      Transaction.list(options['account_id'], (error, response) => {
        if (response) {
          this.renderTransactions(response['data'])
        }
      })
    }
  }


  /** Очищает страницу. Вызывает TransactionsPage.renderTransactions() с пустым массивом. Устанавливает заголовок: «Название счёта» */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /** Устанавливает заголовок в элемент .content-title */
  renderTitle(name){
    let contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = name;
  }

  /** Форматирует дату в формате 2019-03-10 03:20:41 (строка) в формат «10 марта 2019 г. в 03:20» */
  formatDate(date){
    const months = {
      '01': 'января',
      '02': 'февраля',
      '03': 'марта',
      '04': 'апреля',
      '05': 'мая',
      '06': 'июня',
      '07': 'июля',
      '08': 'августа',
      '09': 'сентября',
      '10': 'октября',
      '11': 'ноября',
      '12': 'декабря',
    }
    let arr = date.split(' '); // ['2019-03-10', '03:20:41'];
    let arrDate = arr[0]; // '2019-03-10'
    let arrTime = arr[1]; // '03:20:41'
    let arrFormatDate = arrDate.split('-') // ['2019', '03', '10']
    let arrFormatTime = arrTime.split(':') // ['03', '20', '41']
    return arrFormatDate[2] + ' ' + months[arrFormatDate[1]] + ' '+ arrFormatDate[0] + ' г. в ' + arrFormatTime[0] + ':' +     arrFormatTime[1];
  }

  /** Формирует HTML-код транзакции (дохода или расхода). item - объект с информацией о транзакции */
  getTransactionHTML(item){
    return `
    <div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>
    </div>`
  }

  /** Отрисовывает список транзакций на странице используя getTransactionHTML */
  renderTransactions(data){
    let content = this.element.querySelector('.content');
    let oldTransactions = this.element.querySelectorAll('.transaction');
    for (let oldTransaction of oldTransactions) {
      oldTransaction.remove();
    }
    for (let item of data) {
      content.insertAdjacentHTML('beforeend' , this.getTransactionHTML(item));
    }
    this.registerEvents();
  }
}