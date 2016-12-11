import React, { Component } from 'react';
import { Link } from 'react-router';

class History extends Component {
   constructor(props) {
      super(props);
      this.state = {
         'items': [],
         'showReloadButton': false,
      };

      this.reloadItemsFromDb = this.reloadItemsFromDb.bind(this);
      this.showReloadButton = this.showReloadButton.bind(this);
   }

   async componentDidMount() {
      let db = this.props.route.database;
      await this.reloadItemsFromDb();
      db.registerUpdateListener(this.showReloadButton);
   }

   componentWillUnmount() {
      let db = this.props.route.database;
      db.unregisterUpdateListener(this.showReloadButton);
   }

   showReloadButton() {
      this.setState({
         'showReloadButton': true,
      });
   }

   async reloadItemsFromDb() {
      let db = this.props.route.database;
      let result = await db.getLatest(50);
      this.setState({
         'showReloadButton': false,
         'items': result.rows.map((doc) => {
            return (
               <li key={doc.id}>
                  <b>{doc.doc.type}:</b> {doc.doc.fieldValues.timestamp} (<Link to={`/log/${doc.doc.type}/${doc.id}`}>edit</Link>)
               </li>
            );
         })
      });
   }

   render() {
      let reloadButton = null;
      if (this.state.showReloadButton) {
         reloadButton = <button onClick={this.reloadItemsFromDb}>Reload items from db</button>;
      }

      return (
         <div>
            <h1>History</h1>
            {reloadButton}
            <ul>
               {this.state.items}
            </ul>
         </div>
      );
   }
}

export default History;
