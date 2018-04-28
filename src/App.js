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
    this.state = {
      newItem: "",
      list: []
    };
  };

  updateInput(value) {
    // update react state
    this.setState({ "newItem": value });
  };

  addItem() {
    // create a new item
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice()
    };

    // copy current list of items
    const list = [...this.state.list];

    // add the new item to the list
    list.push(newItem);

    // update state with new list, reset the new item input
    this.setState({
      list,
      newItem: ""
    });
  };

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted
    const updatedList = list.filter(item => item.id !== id);

    this.setState({ list: updatedList });
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
            placeholder="Enter new todo ..."
            value={this.state.newItem}
            onChange={e => this.updateInput(e.target.value)}
            onKeyPress={(e) => {if(e.key === 'Enter') {this.addItem()}}}/>


          <button data-tip data-for="addButton"
            onClick={() => {this.addItem(); Tooltip.hide();}}
            disabled={!this.state.newItem.length}>+
          </button>

          <ul>
            {this.state.list.map(item => {
              // todo: find solution with only one tooltip element
              return (
                <li key={item.id}>
                  {item.value}
                  <button 
                    data-tip data-for="removeButton" 
                    onClick={() => this.deleteItem(item.id)}>
                    -
                  </button>

                  <Tooltip id="removeButton" effect="solid" type="warning">
                    remove todo from the list, no undo possible
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
