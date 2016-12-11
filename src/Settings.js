import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';

class Settings extends Component {
   constructor(props) {
      super(props);
      this.state = {
         "fieldValues": {
            "syncUrl": "",
         }
      };

      this.updateField = this.updateField.bind(this);
      this.saveState = this.saveState.bind(this);
   }

   componentDidMount() {
      let db = this.props.route.database;
      let that = this;
      that.setState((prevState) => {
         prevState.fieldValues.syncUrl = db.getSyncUrl();
      });
   }

   updateField(name) {
      let that = this;
      return function(e) {
         let value = e.target.value;
         that.setState((prevState) => {
            prevState.fieldValues[name] = value;
         });
      };
   };

   saveState() {
      let db = this.props.route.database;
      db.setSyncUrl(this.state.fieldValues.syncUrl);
   };

   render() {
      return (
         <div>
            <h1>Settings</h1>
            <div className="form-group">
               <label>Sync URL</label>
               <input type="text" value={this.state.fieldValues.syncUrl} onChange={this.updateField("syncUrl")} />
            </div>

            <div className="action-bar">
               <button onClick={this.saveState} className="btn btn--large">Save</button>
               <Link to="/" className="btn btn--large btn--link">Cancel</Link>
            </div>
         </div>
      );
   }
}

export default withRouter(Settings);
