import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Title from './common/Title';
import Section from './common/Section';
import Card from './common/Card';
import Modal from './common/Modal';
import { confirmAlert } from 'react-confirm-alert';

class VoteList extends Component{
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData() {
    this.props._handleFetchData();
  }

  _handleDelete = (onClose, data) => {
    this.props._handleFetchData('DELETE', data);
    onClose();
  }

  _handleSave = (onClose, data, path) => {
    this.props._handleFetchData('PUT', data, path);
    onClose();
  }

  _settingVote = (type, data) => {    
    return( 
      confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {              
          return (
            <Modal 
              type={type}
              data={data}
              onClose={onClose} 
              handleSave={this._handleSave} 
              handleDelete={this._handleDelete} 
            />
          )
        }      
      })
    )
  }

  _voting = (type, data) => {
    return( 
      confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {              
          return (
            <Modal 
              type={type}
              data={data}
              onClose={onClose} 
              handleSave={this._handleSave} 
              handleDelete={this._handleDelete} 
            />
          )
        }      
      })
    )
  }

  _resultVote = (type, data) => {
    return( 
      confirmAlert({
        closeOnEscape: true,
        closeOnClickOutside: true,
        customUI: ({ onClose }) => {              
          return (
            <Modal 
              type={type}
              data={data}
              onClose={onClose} 
              handleDelete={this._handleDelete} 
            />
          )
        }      
      })
    )
  }

  _renderData(data, type) {
    const mappingData = data.map((v,i) => {
      return (
        <div key={i} className={'container__card'}>
          <Card data={data[i]} type={type} settingVote={this._settingVote} voting={this._voting} resultVote={this._resultVote} />
        </div>
      )
    });

    return mappingData;
  }

  render(){
    const {standingData, onGoingData, closedData, error , loading} = this.props;
    if (error) {
      return <div className={'no-data'}>네트워크 오류입니다.<br/><br/>잠시후에 다시 시도해주세요.</div>;
    }

    if (loading) {
      return <div className={'no-data'}>Loading <FontAwesomeIcon icon={faSpinner} spin={true} /></div>;
    }
    
    if(standingData || onGoingData || closedData) {
      return(
        <Section className={'container__section'}>        
          {!!standingData.length && (
            <div className={"container__row"}>
              <Title key='title' className="container__title">Standing vote</Title>
              {this._renderData(standingData, 'standing')}
            </div>
          )}
          {!!onGoingData.length && (
            <div className={"container__row"}>
              <Title key='title' className="container__title">Ongoing vote</Title>
              {this._renderData(onGoingData, 'ongoing')}
            </div>
          )}
          {!!closedData.length && (
            <div className={"container__row"}>
              <Title key='title' className="container__title">Closed vote</Title>
              {this._renderData(closedData, 'closed')}
            </div>
          )}
        </Section>
      )
    }

    return(
      <div>
        데이터가 없습니다.
      </div>
    )
  }
}

VoteList.propTypes = {
  standingData: PropTypes.array,
  onGoingData: PropTypes.array,  
  closedData: PropTypes.array,  
  data: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  _handleFetchData: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  _handleFetchData: (method, data, path) => { dispatch(actions.fetchData(method, data, path)) },
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


export default connect(mapStateToProps, mapDispatchToProps)(VoteList);
  