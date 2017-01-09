import React, { Component } from 'react';
import { findDefinition } from './EventDefinitions';
import { Link, withRouter } from 'react-router';
import TimePicker from './TimePickerWidget';
import Range from './RangeWidget';
import * as Session from './Session';
import { Number } from './BasicInputWidget';
import "./LogEvent.css";

class LogEvent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         "fieldValues": {},
         "definition": false
      };
      this.oldRevision = 0;

      this.updateStateFactory = this.updateStateFactory.bind(this);
      this.saveState = this.saveState.bind(this);
   }

   async componentDidMount() {
      if (this.props.params.eventId) {
         let db = this.props.route.database;
         let doc = await db.get(this.props.params.eventId);
         this.oldRevision = doc._rev; 
         this.setState({
            "fieldValues": doc.fieldValues,
            "definition": findDefinition(doc.type)
         });
      } else {
         this.setState({
            "definition": findDefinition(this.props.params.eventType)
         });
      }
   }

   updateStateFactory(name) {
      let that = this;
      return function(value) {
         that.setState((prevState) => {
            prevState.fieldValues[name] = value;
         });
      };
   };

   async saveState() {
      let db = this.props.route.database;
      let that = this;
      if (this.props.params.eventId) {
         await db.update({
            '_id': this.props.params.eventId,
            '_rev': this.oldRevision,
            'type': this.state.definition.type,
            'fieldValues': this.state.fieldValues
         });
      } else {
         await db.create({
            'type': this.state.definition.type,
            'fieldValues': this.state.fieldValues
         });
      }
      Session.flash('event.saved', true);
      that.props.router.push('/');
   };

   render() {
      if (!this.state.definition) {
         return (
            <div>Could not find definition for {this.props.params.eventType}.</div>
         );
      }

      let components = this.state.definition.fields.map((component, i) => {
         switch (component.type) {
            case "range":
               let val = this.state.fieldValues[component.name] || component.properties.min;
               return (
                  <div className="form-group" key={i}>
                     <label>{component.label}</label>
                     <Range
                        onChange={this.updateStateFactory(component.name)}
                        value={val}
                        min={component.properties.min}
                        max={component.properties.max}/>
                  </div>
               );
            case "number":
               return (
                  <div className="form-group" key={i}>
                     <label>{component.label}</label>
                     <Number
                        onChange={this.updateStateFactory(component.name)}
                        value={this.state.fieldValues[component.name]} />
                  </div>
               );
            default:
               return <div key={i}>Unknown</div>;
         }
      });

      return (
         <div>
            <h1>Log event - {this.state.definition.name}</h1>

            {components}
            <div className="form-group">
               <label>Timestamp</label>
               <TimePicker
                  key="timestamp"
                  value={this.state.fieldValues.timestamp}
                  onChange={this.updateStateFactory("timestamp")} />
            </div>

            <div className="action-bar">
               <button onClick={this.saveState} className="btn btn--large">Save log</button>
               <Link to="/" className="btn btn--large btn--link">Cancel</Link>
            </div>
         </div>
      );
   }
}

export default withRouter(LogEvent);
