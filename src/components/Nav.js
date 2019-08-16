import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Button from './common/Button';
import Modal from './common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { confirmAlert } from 'react-confirm-alert';

class Nav extends Component{
  constructor(props){
    super(props);
    this.state = {
      voteCnt:3
    }
  }

  _handleSave = (onClose, data) => {
    this.props._handleFetchData('POST', data);
    onClose();
  }
  
  _closeModal = (onClose) => {
    this.setState({
      voteCnt: 3
    });
    onClose();
  }
  
  _addContent = () => {    
    if(this.state.voteCnt > 6){
      return;
    } else {
      this.setState({
        voteCnt: this.state.voteCnt + 1
      });
    }
    
    this._createVote('create');
  };

  _createVote = (type) => {
    return( 
      confirmAlert({
        closeOnEscape: true,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {              
          return (
            <Modal 
              type={type}
              voteCnt={this.state.voteCnt} 
              onClose={onClose} 
              addContent={this._addContent} 
              closeModal={this._closeModal}
              handleSave={this._handleSave}
            />
          )
        }      
      })
    )   
  }

  render(){
    return(      
      <nav>
        <Button onClick={(()=>{this._createVote('create')})} className='nav__button'>
          <FontAwesomeIcon icon={faPlus} /> Create Vote
        </Button>
      </nav>
    )
  }
}

Modal.propTypes = {
  _handleFetchData: PropTypes.func,   
};

const mapDispatchToProps = dispatch => ({
  _handleFetchData: (method, data) => { dispatch(actions.fetchData(method, data)) },
})

const mapStateToProps = (state) => {
  let obj = {};

  for(let i in state.interfaceReducer){
    if(state.interfaceReducer.hasOwnProperty(i)){
      obj[i] = state.interfaceReducer[i]
    }
  }
  return obj;
};


export default connect(mapStateToProps, mapDispatchToProps)(Nav);