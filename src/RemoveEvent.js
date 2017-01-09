import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';

class RemoveEvent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         "eventFieldJson": false,
      };

      this.deleteEvent = this.deleteEvent.bind(this);
   }

   async componentDidMount() {
      if (this.props.params.eventId) {
         let db = this.props.route.database;
         let doc = await db.get(this.props.params.eventId);
         this.setState({
            "eventFieldJson": doc.type + ": " + JSON.stringify(doc.fieldValues),
            "doc": doc
         });
      }
   }

   async deleteEvent() {
      let db = this.props.route.database;
      await db.remove(this.state.doc);

      this.props.router.push('/history');
   };

   render() {
      if (!this.state.eventFieldJson) {
         return <p>No event matching this id found</p>;
      }

      return (
         <div>
            <h1>Remove event</h1>
            <p>Please confirm you want to remove the following event:</p>
            <code>{this.state.eventFieldJson}</code>

            <div className="action-bar">
               <button onClick={this.deleteEvent} className="btn btn--large">Remove</button>
               <Link to="/history" className="btn btn--large btn--link">Cancel</Link>
            </div>
         </div>
      );
   }
}

export default withRouter(RemoveEvent);
