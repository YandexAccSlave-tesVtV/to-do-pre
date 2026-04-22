// Элементы DOM (предполагается, что они уже объявлены в глобальной области видимости)
// const listElement = document.querySelector('.to-do__list');
// const formElement = document.querySelector('.to-do__form');
// const inputElement = document.querySelector('.to-do__input');
// const template = document.querySelector('#to-do__item-template');

// Предустановленный список задач
const defaultTasks = [
  'Купить продукты',
  'Сделать домашнее задание',
  'Позвонить маме',
  'Погулять с собакой',
  'Почитать книгу',
  'Выучить JavaScript'
];

// Глобальная переменная для хранения текущего списка задач
let items = [];

// Функция загрузки задач из локального хранилища или возврат предустановленного списка
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    return JSON.parse(savedTasks);
  }
  return defaultTasks;
}

// Функция сохранения задач в локальное хранилище
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция сбора текущих задач из DOM
function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
  const tasks = [];
  itemsNamesElements.forEach(element => {
    tasks.push(element.textContent);
  });
  return tasks;
}

// Функция создания элемента задачи с обработчиками событий
function createItem(text) {
  // Клонируем содержимое шаблона
  const clone = template.content.cloneNode(true).firstElementChild;

  // Находим элементы внутри клона
  const textElement = clone.querySelector('.to-do__item-text');
  const deleteButton = clone.querySelector('.to-do__item-button_type_delete');
  const duplicateButton = clone.querySelector('.to-do__item-button_type_duplicate');
  const editButton = clone.querySelector('.to-do__item-button_type_edit');

  // Устанавливаем текст задачи
  textElement.textContent = text;

  // Обработчик удаления задачи
  deleteButton.addEventListener('click', () => {
    clone.remove(); // Удаляем элемент задачи из DOM
    const updatedTasks = getTasksFromDOM();
    saveTasks(updatedTasks);
  });

  // Обработчик копирования задачи
  duplicateButton.addEventListener('click', () => {
    const taskText = textElement.textContent;
    const newItem = createItem(taskText);
    listElement.prepend(newItem);
    const updatedTasks = getTasksFromDOM();
    saveTasks(updatedTasks);
  });

  // Обработчик редактирования задачи
  editButton.addEventListener('click', () => {
    textElement.contentEditable = 'true';
    textElement.focus();
  });

  // Обработчик потери фокуса при редактировании
  textElement.addEventListener('blur', () => {
    textElement.contentEditable = 'false';
    const updatedTasks = getTasksFromDOM();
    saveTasks(updatedTasks);
  });

  return clone;
}

// Инициализация приложения
items = loadTasks();

// Отображаем начальные задачи в DOM
items.forEach(task => {
  const taskElement = createItem(task);
  listElement.appendChild(taskElement);
});

// Сохраняем начальное состояние в локальное хранилище (если оно было пустым)
if (!localStorage.getItem('tasks')) {
  saveTasks(items);
}

// Обработчик отправки формы (добавление новой задачи)
formElement.addEventListener('submit', (event) => {
  event.preventDefault(); // Отменяем перезагрузку страницы

  const newTaskText = inputElement.value.trim();
  if (newTaskText === '') return; // Не добавляем пустые задачи

  const newTaskElement = createItem(newTaskText);
  listElement.prepend(newTaskElement);

  inputElement.value = ''; // Очищаем поле ввода

  const updatedTasks = getTasksFromDOM();
  saveTasks(updatedTasks);
});
