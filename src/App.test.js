import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { maxTodoLength } from './App';
import 'jest-localstorage-mock';

describe('the todo.react app', () => {

  let div, todoApp;
  
  beforeEach(() => {
    div = document.createElement('div');
    todoApp = ReactDOM.render(<App />, div);
    localStorage.clear();
  });
  
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    localStorage.clear();
  });

  it('renders without crashing', () => {
    expect(div).toBeDefined();
    expect(todoApp).toBeDefined();
  });

  it('starts with an empty todo list', () => {
    const initialAppState = {
        newItem: {
          todo: "",
          done: false
        },
        list: []
      };
    expect(todoApp.state).toEqual(initialAppState);
  });

  it('validates updated todo descriptions', () => {
    expect(todoApp.validateUpdatedTodo('valid todo')).toBe(true);

    var invalidTodo = '';
    for(var i=0; i<=maxTodoLength; i++){
      invalidTodo += 'x';
    }
    expect(todoApp.validateUpdatedTodo(invalidTodo)).toBe(false);
  });

  it('saves state of new todo', () => {
    todoApp.updateInput('new todo');
    expect(todoApp.state.newItem.todo).toEqual('new todo');
    expect(todoApp.state.newItem.done).toBe(false);
  });

  it('adds todo to list', () => {
    todoApp.updateInput('new todo');
    todoApp.addItem();

    // new todo reset
    expect(todoApp.state.newItem.todo).toEqual('');
    expect(todoApp.state.newItem.done).toBe(false);
    
    // addition successful
    expect(todoApp.state.list.length).toBe(1);
    expect(todoApp.state.list[0].value.todo).toEqual('new todo');
    expect(todoApp.state.list[0].value.done).toBe(false);
  });

  it('deletes todo from list', () => {
    todoApp.updateInput('new todo');
    todoApp.addItem();
    
    // addition successful
    expect(todoApp.state.list.length).toBe(1);
    
    todoApp.deleteItem(todoApp.state.list[0].id);

    // deletion successful
    expect(todoApp.state.list.length).toBe(0);
  });

   it('marks todo as done', () => {
    todoApp.updateInput('new todo');
    todoApp.addItem();

    todoApp.checkItem(todoApp.state.list[0].id);

    // mark as done successful
    expect(todoApp.state.list.length).toBe(1);
    expect(todoApp.state.list[0].value.todo).toEqual('new todo');
    expect(todoApp.state.list[0].value.done).toBe(true);
  });

  it('marks done todo as open', () => {
    todoApp.updateInput('new todo');
    todoApp.addItem();

    todoApp.checkItem(todoApp.state.list[0].id);
    todoApp.checkItem(todoApp.state.list[0].id);

     // mark as done successful
    expect(todoApp.state.list.length).toBe(1);
    expect(todoApp.state.list[0].value.todo).toEqual('new todo');
    expect(todoApp.state.list[0].value.done).toBe(false);
  });

  it('updates existing todo text', () => {
    todoApp.updateInput('new todo');
    todoApp.addItem();

    var updatedTodo = {};
    updatedTodo[todoApp.state.list[0].id] = 'updated todo';

    todoApp.todoUpdated(updatedTodo);

   // mark as done successful
    expect(todoApp.state.list.length).toBe(1);
    expect(todoApp.state.list[0].value.todo).toEqual('updated todo');
    expect(todoApp.state.list[0].value.done).toBe(false);
  });

});