//------------------------------------------------------------------------------
// todo.react by Robert I. Horvath 
// my first React web app ever :)
// inspiration: https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
//------------------------------------------------------------------------------

import React, { Component } from 'react';
import Tooltip from "react-tooltip"
import logo from './logo.svg';
import SimpleStorage from "react-simple-storage";
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.maxTodoLength = 50;
    this.state = {
      newItem: {
        todo: "",
        done: false
      },
      list: []
    };
  };

  updateInput(value) {
    // update react state
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
    console.log(currentItem);
    currentItem.value.done = !currentItem.value.done;
    console.log(currentItem.value.done);

    this.setState({ list: updatedList });
    Tooltip.hide();
  };

  render() {

    return (
      <div className="App">

      <SimpleStorage parent={this} />

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">todo.react</h1>
        </header>

        <div>
          
          <input
            type="text"
            maxlength = {this.maxTodoLength}
            placeholder="Enter new todo ..."
            value={this.state.newItem.todo}
            onChange={e => this.updateInput(e.target.value)}
            onKeyPress={(e) => {if(e.key === 'Enter') {this.addItem()}}}/>


          <button data-tip data-for="addButton"
            onClick={() => {this.addItem(); Tooltip.hide();}}
            disabled={!this.state.newItem.todo.length}>+
          </button>

          <ul>
            {this.state.list.map(item => {
              // todo: find solution with only one tooltip element
              return (
                <li key={item.id}>
                  <span data-tip data-for="inPlaceEdit">
                    {item.value.todo + " - "+ item.value.done}
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
        
        <Tooltip id="addButton" effect="solid" type="success">
            Add todo to the list
          </Tooltip>
          
          

        </div>
      </div>
    );
  };
}

export default App;
