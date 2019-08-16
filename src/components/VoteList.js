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

  _closeModal = (onClose) => {
    onClose();
  }

  _handleDelete = (onClose, data) => {
    this.props._handleFetchData('DELETE', data);
    onClose();
  }

  _handleSave = (onClose, data) => {
    this.props._handleFetchData('PUT', data);
    onClose();
  }

  _settingVote = (type, data) => {
    return( 
      confirmAlert({
        closeOnEscape: true,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {              
          return (
            <Modal 
              type={type}
              data={data}
              voteCnt={Object.keys(data.contents).length}
              onClose={onClose} 
              closeModal={this._closeModal} 
              handleSave={this._handleSave} 
              handleDelete={this._handleDelete} 
            />
          )
        }      
      })
    )
  }

  _renderData(standing, onGoing, closed) {
    const chunk = (array, size) => {
      return array.reduce((chunks, item, i) => {
        if (i % size === 0) chunks.push([item]);
        else chunks[chunks.length - 1].push(item);
        return chunks;
      }, []);
    }

    const chunkStanding = chunk(standing, 3);
    const chunkOnGoing = chunk(onGoing, 3);
    const chunkClosed = chunk(closed, 3);

    const standingData = chunkStanding.map((v,i) => {
      return (
        <div key={i} className={"container__row"}>
          <Card data={chunkStanding[i]} type='standing' settingVote={this._settingVote} />
        </div>
      )
    });

    const onGoingData = chunkOnGoing.map((v,i) => {
      return (
        <div key={i} className={"container__row"}>
          <Card data={chunkOnGoing[i]} type='ongoing' />
        </div>
      )
    });

    const closedData = chunkClosed.map((v,i) => {
      return (
        <div key={i} className={"container__row"}>
          <Card data={chunkClosed[i]} type='closed' />
        </div>
      )
    });

    if(standing.length) standingData.unshift(<Title key="standing_title" className="container__title">Standing vote</Title>);
    if(onGoing.length) onGoingData.unshift(<Title key="ongoing_title" className="container__title">Ongoing vote</Title>);
    if(closed.length) closedData.unshift(<Title key="closed_title" className="container__title">Closed vote</Title>);
    return [standingData, onGoingData, closedData];
  }

  render(){
    const {standingData, onGoingData, closedData, error , loading} = this.props;
    if (error) {
      return <div className={'noItems'}>네트워크 오류입니다.<br/><br/>잠시후에 다시 시도해주세요.</div>;
    }

    if (loading) {
      return <div className={'noItems'}>Loading <FontAwesomeIcon icon={faSpinner} spin={true} /></div>;
    }
    
    if(onGoingData && closedData) {
      return(
        <Section className={'container__section'}>
          {this._renderData(standingData, onGoingData, closedData)}
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


export default connect(mapStateToProps, mapDispatchToProps)(VoteList);
  