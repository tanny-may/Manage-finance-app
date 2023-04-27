/** Класс CreateTransactionForm управляет формой создания новой транзакции */
class CreateTransactionForm extends AsyncForm {
  /** Вызывает родительский конструктор и метод renderAccountsList */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /** Получает список счетов с помощью Account.list Обновляет в форме всплывающего окна выпадающий список */
  renderAccountsList() {
    Account.list(null, (error, result) => {
      if (result) {
        let select = this.element.querySelector('.accounts-select');
        let options = select.querySelectorAll('option');
        for (let option of options) {
          option.remove();
        }
        for (let item of result.data) {
          select.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.name}</option>`);
        }
      }
    });
  }

  /** Создаёт новую транзакцию (доход или расход) с помощью Transaction.create. По успешному результату вызывает App.update(), сбрасывает форму и закрывает окно, в котором находится форма */
  onSubmit(data) {
    Transaction.create(data, (error, result) => {
      if (result) {
        let formName;
        switch (data.type) {
           case 'expense':
            formName = 'newExpense';
            break;
           case 'income':
            formName = 'newIncome';
            break;
        }
      App.getModal(formName).close();
      App.update();
      }
    });
  }
}