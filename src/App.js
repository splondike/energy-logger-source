import React, { Component } from 'react';
import { Link } from 'react-router'
import './App.css';

class App extends Component {
   render() {
      return (
         <div className="container">
            <ul className="header-nav">
               <li><Link to="/">Dashboard</Link></li>
               <li><Link to="/history">History</Link></li>
               <li><Link to="/settings">Settings</Link></li>
            </ul>
            {this.props.children}
         </div>
      );
   }
}

export default App;
