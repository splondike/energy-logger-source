import React, { Component } from 'react';
import EventDefinitions from './EventDefinitions';
import { Link } from 'react-router';
import './Dashboard.css';

class Dashboard extends Component {
   render() {
      let links = EventDefinitions.map((loggable) => {
         return (
            <Link
               key={loggable.type}
               className="btn btn--block btn--large"
               to={`/log/${loggable.type}/new`}>{loggable.name}</Link>
         );
      });
      return (
         <div className="dashboard">
            <h1>Dashboard</h1>
            {links}
         </div>
      );
   }
}

export default Dashboard;
