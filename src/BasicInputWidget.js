import React, { Component } from 'react';

class Number extends Component {
   constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
   }

   handleChange() {
      if (this.props.onChange) {
         this.props.onChange(this.input.value);
      }
   }

   componentDidMount() {
      this.handleChange();
   }

   render() {
      return (
         <input
            type="number"
            value={this.props.value}
            onChange={this.handleChange}
            ref={(input) => this.input = input} />
      );
   }
};

export {Number};
