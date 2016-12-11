import React, { Component } from 'react';
import './RangeWidget.css';

class Range extends Component {
   constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
   }

   handleChange(e) {
      if (this.props.onChange) {
         this.props.onChange(parseInt(e.target.value, 10));
      }
   }

   componentDidMount() {
      if (this.props.onChange) {
         this.props.onChange(this.props.value);
      }
   }

   render() {
      return (
         <input
            className="range-widget"
            type="range"
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            onChange={this.handleChange} />
      );
   }
};

export default Range;
