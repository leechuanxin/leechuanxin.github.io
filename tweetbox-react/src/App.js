import React, { Component } from 'react';

class Tweetbox extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.togglePhoto = this.togglePhoto.bind(this);
    this.state = {
      text: '',
      photoAdded: false
    };
  };

  handleChange(evt) {
    this.setState({text: evt.target.value});
  };

  overflowAlert() {
    if (this.remainingCharacters() < 0) {
      var beforeOverflowText;
      var overflowText;

      if (this.state.photoAdded) {
        beforeOverflowText = this.state.text.substring(140 - 23 - 10, 140 - 23);
        overflowText = this.state.text.substring(140 - 23);
      } 
      else {
        beforeOverflowText = this.state.text.substring(140 - 10, 140);
        overflowText = this.state.text.substring(140);
      }
      
      return (
        <div className="alert alert-warning">
          <strong>Oops! Too Long:</strong>
          &nbsp;...{beforeOverflowText}
          <strong className="bg-danger">{overflowText}</strong>
        </div>
      );
    }
    else {
      return "";
    }
  }

  remainingCharacters() {
    if (this.state.photoAdded) {
      return 140 - 23 - this.state.text.length;
    }
    else {
      return 140 - this.state.text.length;
    }
  };

  togglePhoto(evt) {
    this.setState({photoAdded: !this.state.photoAdded});
  };

  render() {
    return (
      <div className="well clearfix">
        {this.overflowAlert()}
        <textarea className="form-control" onChange={this.handleChange}></textarea>
        <br />
        <span>{this.remainingCharacters()}</span>
        <button className="btn btn-primary pull-right" disabled={this.state.text.length === 0 && !this.state.photoAdded}>Tweet</button>
        <button className="btn btn-default pull-right" onClick={this.togglePhoto}>{this.state.photoAdded ? '\u2713 Photo Added' : 'Add Photo'}</button>
      </div>
    );
  }
}

export default Tweetbox;
