import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faVoteYea } from '@fortawesome/free-solid-svg-icons'
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
      return <div className={'no-data'}>&#x1F6A8;서버 점검중입니다.<br/><br/>잠시후에 다시 시도해주세요.</div>;
    }

    if (loading) {
      return <div className={'no-data'}>Loading <FontAwesomeIcon icon={faSpinner} spin={true} /></div>;
    }
    
    if(standingData || onGoingData || closedData) {
      return(
        <Section className={'container__section'}>        
          {!!standingData.length && (
            <div className={"container__row vote__row--standing"}>
              <Title key='title' className="container__title">&#129304; 대기중인 투표</Title>
              {this._renderData(standingData, 'standing')}
            </div>
          )}
          {!!onGoingData.length && (
            <div className={"container__row vote__row--ongoing"}>
              <Title key='title' className="container__title">&#x1F525; 진행중인 투표</Title>
              {this._renderData(onGoingData, 'ongoing')}
            </div>
          )}
          {!!closedData.length && (
            <div className={"container__row vote__row--closed"}>
              <Title key='title' className="container__title">&#x2705; 종료된 투표</Title>
              {this._renderData(closedData, 'closed')}
            </div>
          )}
        </Section>
      )
    } else {
      return(
        <div className={'no-data'}>
          <FontAwesomeIcon icon={faVoteYea} size={"2x"} color={"#0072ff"} />
          <h3><b style={{color:'#0072ff'}}>선한 영향력</b><br />투표를 만들어주세요&#129304;</h3>
        </div>
      )
    }
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

  for(let i in state.reducer){
    if(state.reducer.hasOwnProperty(i)){
      obj[i] = state.reducer[i]
    }
  }
  return obj;
};


export default connect(mapStateToProps, mapDispatchToProps)(VoteList);
  