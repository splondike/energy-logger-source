import React, { Component } from 'react';
import EventDefinitions from './EventDefinitions';
import * as Session from './Session';
import { Link } from 'react-router';
import './Dashboard.css';

class Dashboard extends Component {
   constructor(props) {
      super(props);
      this.state = {
         "showSavedMessage": false,
      };
   }

   componentDidMount() {
      this.setState({
         "showSavedMessage": Session.get('event.saved', false)
      });
   }

   render() {
      let links = EventDefinitions.map((loggable) => {
         return (
            <Link
               key={loggable.type}
               className="btn btn--block btn--large"
               to={`/log/new/${loggable.type}`}>{loggable.name}</Link>
         );
      });

      let savedMessage = null;
      if (this.state.showSavedMessage) {
         savedMessage = <p>Event saved</p>;
      }
      return (
         <div className="dashboard">
            {savedMessage}
            <h1>Dashboard</h1>
            {links}
         </div>
      );
   }
}

export default Dashboard;
