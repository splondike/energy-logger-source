import React, { Component } from 'react';
import moment from 'moment/min/moment.min';
import './TimePickerWidget.css';

class TimePicker extends Component {
   constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
   }

   handleChange() {
      if (this.props.onChange) {
         let timestamp = moment(this.dateInput.value + " " + this.timeInput.value);
         this.props.onChange(timestamp.format());
      }
   }

   componentDidMount() {
      this.handleChange();
   }

   render() {
      let time = this.props.value === null ?
         moment() : moment(this.props.value);
      let dateValue = time.format("YYYY-MM-DD");
      let timeValue = time.format("HH:mm");

      return (
         <div className="time-picker">
            <input
               type="date"
               value={dateValue}
               onChange={this.handleChange}
               ref={(input) => this.dateInput = input} />
            <input
               type="time"
               value={timeValue}
               onChange={this.handleChange}
               ref={(input) => this.timeInput = input} />
         </div>
      );
   }
};

export default TimePicker;
