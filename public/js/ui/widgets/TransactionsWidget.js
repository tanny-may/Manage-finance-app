/** Класс TransactionsWidget отвечает за открытие всплывающих окон для создания нового дохода или расхода */
class TransactionsWidget {
  /** Устанавливает полученный элемент в свойство element. Если переданный элемент не существует, необходимо выкинуть ошибку. */
  constructor( element ) {
    this.element = element;
    if (!element) {
      throw new Error('Переданный элемент не существует');
    }
    this.registerEvents();
  }
  /** Регистрирует обработчики нажатия на кнопки «Новый доход» и «Новый расход». При нажатии вызывает Modal.open() для экземпляра окна */
  registerEvents() {
    let incomeButton = this.element.querySelector('.create-income-button');
    incomeButton.addEventListener('click', () => {
      App.getModal('newIncome').open();
    })

    let expenseButton = this.element.querySelector('.create-expense-button');
    expenseButton.addEventListener('click', () => {
      App.getModal('newExpense').open();
    })
  }
}
