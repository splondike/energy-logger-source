import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, hashHistory } from 'react-router'
import App from './App';
import Dashboard from './Dashboard';
import LogEvent from './LogEvent';
import History from './History';
import RemoveEvent from './RemoveEvent';
import setupDb from './PouchSetup';
import Settings from './Settings';
import "./index.css";

setupDb().then(function(db) {
   ReactDOM.render(
      <Router history={hashHistory}>
         <Route path="/" component={App}>
            <IndexRoute component={Dashboard}/>
            <Route path="/log/new/:eventType" database={db} component={LogEvent}/>
            <Route path="/log/:eventId/edit" database={db} component={LogEvent}/>
            <Route path="/log/:eventId/remove" database={db} component={RemoveEvent}/>
            <Route path="/history" database={db} component={History}/>
            <Route path="/settings" database={db} component={Settings}/>
         </Route>
      </Router>,
      document.getElementById('root')
   );
});
