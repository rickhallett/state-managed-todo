import store from './js/lib/state/store/index.js'; 
import Count from './js/lib/state/components/count.js';
import List from './js/lib/state/components/list.js';
import Status from './js/lib/state/components/status.js';

const formElement = document.querySelector('.js-form');
const inputElement = document.querySelector('#new-item-field');

store.events.subscribe('updateLocalStorage', (state) => localStorage.setItem('stateTodo', JSON.stringify(state)))

formElement.addEventListener('submit', evt => {
    evt.preventDefault();
  
    let value = inputElement.value.trim();
  
    if(value.length) {
      store.dispatch('addItem', value);
      inputElement.value = '';
      inputElement.focus();
    }
});

const countInstance = new Count();
const listInstance = new List();
const statusInstance = new Status();

countInstance.render();
listInstance.render();
statusInstance.render();