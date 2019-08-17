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
  }

  _handleSave = (onClose, data) => {
    this.props._handleFetchData('POST', data);
    onClose();
  }
    
  _createVote = (type) => {
    return( 
      confirmAlert({
        closeOnEscape: true,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {              
          return (
            <Modal 
              data={{}}
              type={type}
              onClose={onClose} 
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

Modal.propTypes = {
  _handleFetchData: PropTypes.func,   
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);