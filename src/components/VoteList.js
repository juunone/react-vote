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

  _handleSave = (onClose, data) => {
    this.props._handleFetchData('PUT', data);
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

  _resultVote = (type, data) => {
    return( 
      confirmAlert({
        closeOnEscape: true,
        closeOnClickOutside: false,
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
    // const chunk = (array, size) => {
    //   return array.reduce((chunks, item, i) => {
    //     if (i % size === 0) chunks.push([item]);
    //     else chunks[chunks.length - 1].push(item);
    //     return chunks;
    //   }, []);
    // }

    // const chunkStanding = chunk(standing, 3);
    // const chunkOnGoing = chunk(onGoing, 3);
    // const chunkClosed = chunk(closed, 3);

    const mappingData = data.map((v,i) => {
      return (
        <div key={i} className={'container__card'}>
          <Card data={data[i]} type={type} settingVote={this._settingVote} resultVote={this._resultVote} />
        </div>
      )
    });

    // const onGoingData = onGoing.map((v,i) => {
    //   return (
    //     <div key={i} className={"container__row"}>
    //       <Card data={onGoing[i]} type='ongoing' />
    //     </div>
    //   )
    // });

    // const closedData = chunkClosed.map((v,i) => {
    //   return (
    //     <div key={i} className={"container__row"}>
    //       <Card data={chunkClosed[i]} type='closed' />
    //     </div>
    //   )
    // });

    // if(data.length) mappingData.unshift(<Title key='title' className="container__title">{title} vote</Title>);
    // console.log(mappingData);
    // if(onGoing.length) onGoingData.unshift(<Title key="ongoing_title" className="container__title">Ongoing vote</Title>);
    // if(closed.length) closedData.unshift(<Title key="closed_title" className="container__title">Closed vote</Title>);
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
              <Title key='title' className="container__title">Staging vote</Title>
              {this._renderData(standingData, 'staging')}
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
  