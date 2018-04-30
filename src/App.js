//------------------------------------------------------------------------------
// todo.react by Robert I. Horvath 
// my first React web app ever :)
// inspiration: https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
//------------------------------------------------------------------------------

import React, { Component } from 'react';
import Tooltip from "react-tooltip"
import logo from './logo.svg';
import SimpleStorage from "react-simple-storage";
import InlineEdit from 'react-edit-inplace';
import './App.css';

const maxTodoLength = 50;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newItem: {
        todo: "",
        done: false
      },
      list: []
    };

    this.todoUpdated = this.todoUpdated.bind(this);
  };

  validateUpdatedTodo(updatedTodo){
    Tooltip.hide();
    return (updatedTodo.length > 0 && updatedTodo.length <= maxTodoLength);
  };

  updateInput(value) {
    this.setState({
     "newItem": {
        todo: value,
        done: false
      }
    });
  };

  addItem() {
    // create a new item
    const newItem = {
      id: 1 + Math.random(),
      value: {
        todo: this.state.newItem.todo.slice(),
        done: false
      }
    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    list.push(newItem);

    // update state with new list, reset the new item input
    this.setState({
      list,
      newItem: {
        todo: "",
        done: false
      }
    });
  };

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({ list: updatedList });
  };

  checkItem(id) {
    // copy current list of items
    const updatedList = [...this.state.list];

    const currentItem = updatedList.filter(item => item.id === id)[0];
    currentItem.value.done = !currentItem.value.done;

    this.setState({ list: updatedList });
    Tooltip.hide();
  };

  todoUpdated(updatedTodo) {
    // TODO: update react-edit-inline to pass objects, too
    const updatedTodoId = Object.keys(updatedTodo)[0];
    const updatedTodoText = updatedTodo[updatedTodoId];

    // copy current list of items
    const updatedList = [...this.state.list];

    const currentItem = updatedList.filter(item => item.id === parseFloat(updatedTodoId))[0];
    currentItem.value.todo = updatedTodoText;

    this.setState({ list: updatedList });
    Tooltip.hide();
  };

  render() {
    return (
      <div className = "App">

        <SimpleStorage parent = {this} />

        <header className = "App-header">
          <img src = {logo} className = "App-logo" alt = "todo.react" />
          <div>
            <span className = "App-title">todo.react </span> 
            <span className = "App-intro">yet another todo web app</span>
          </div>
        </header>

        <div className = "centerDiv">
          <input
            className = "newTodo"
            type="text"
            maxLength = {maxTodoLength}
            placeholder="Enter new todo ..."
            value={this.state.newItem.todo}
            onChange={e => this.updateInput(e.target.value)}
            onKeyPress={(e) => {if(e.key === 'Enter') {this.addItem()}}}/>

          <button 
            data-tip data-for="addButton"
            onClick={() => {this.addItem(); Tooltip.hide();}}
            disabled={!this.state.newItem.todo.length}> 
            +
          </button>

          <Tooltip id="addButton" effect="solid" type="success">
            Add todo to the list
          </Tooltip>
          <br/><br/>
          <ul>
            {this.state.list.map(item => {
              return (
                <li key={item.id}>
                  <span data-tip data-for="inPlaceEdit">
                    <InlineEdit
                      activeClassName = "newTodo"
                      validate = {this.validateUpdatedTodo}
                      text = {item.value.todo}
                      paramName = {"" + item.id}
                      change = {this.todoUpdated}
                      style = {{
                        paddingRight: "10px",
                        textDecoration: item.value.done ? "line-through" : "initial"
                      }} />
                  </span>
                  
                  <Tooltip id="inPlaceEdit" effect="solid">
                    click to edit
                  </Tooltip>

                  <button 
                    data-tip data-for={"doneButton" + item.id} 
                    onClick={() => this.checkItem(item.id)}>
                    {item.value.done ? "\u21bb" : "\u2714"}
                  </button>

                  {item.value.done ? 
                    <Tooltip id={"doneButton" + item.id} effect="solid" type="error">
                      mark "{item.value.todo}" as open
                    </Tooltip> : 
                    <Tooltip id={"doneButton" + item.id} effect="solid" type="success">
                      mark "{item.value.todo}" as done
                    </Tooltip>
                  }

                  <button 
                    data-tip data-for={"deleteButton" + item.id} 
                    onClick={() => this.deleteItem(item.id)}>
                    -
                  </button>

                  <Tooltip id={"deleteButton" + item.id} effect="solid" type="warning">
                    remove "{item.value.todo}" from the list, no undo possible
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };
}

export default App;
