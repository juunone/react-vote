import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faPoll } from '@fortawesome/free-solid-svg-icons'
import Title from './common/Title';
import Button from './common/Button';
import Section from './common/Section';

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

  _renderData(onGoing, closed) {
    const chunk = (array, size) => {
      return array.reduce((chunks, item, i) => {
        if (i % size === 0) chunks.push([item]);
        else chunks[chunks.length - 1].push(item);
        return chunks;
      }, []);
    }

    const makeHtml = (data) => {
      return data.map(v => {
        return (
          <div key={`${v.id}_key`} className={'container__card'}>
            <div className={'container__background'}></div>
            <div className={'container__symbol'}>
              <FontAwesomeIcon icon={faPoll} color={'red'} />
            </div>
            <h3 className={'container__card__title'}>{v.title}</h3>
            <Button className='container__card__button'>VOTE</Button>
          </div>
        )
      });
    }

    const chunkOnGoing = chunk(onGoing, 3);
    const chunkClosed = chunk(closed, 3);

    const onGoingData = chunkOnGoing.map((v,i) => {
      return (
        <div key={i} className={"container__row"}>
          {makeHtml(chunkOnGoing[i])}
        </div>
      )
    });

    const closedData = chunkClosed.map((v,i) => {
      return (
        <div key={i} className={"container__row"}>
          {makeHtml(chunkClosed[i])}
        </div>
      )
    });

    onGoingData.unshift(<Title key="ongoing_title" className="container__title">Ongoing vote</Title>);
    closedData.unshift(<Title key="closed_title" className="container__title">Closed vote</Title>);
    return [onGoingData, closedData];
  }

  render(){
    console.log('thisProps ::',this.props);
    const {data, onGoingData, closedData, error , loading} = this.props;
    if (error) {
      return <div className={'noItems'}>네트워크 오류입니다.<br/><br/>잠시후에 다시 시도해주세요.</div>;
    }

    if (loading) {
      return <div className={'noItems'}>Loading <FontAwesomeIcon icon={faSpinner} spin={true} /></div>;
    }
    
    if(onGoingData && closedData) {
      return(
        <Section className={'container__section'}>
          {this._renderData(onGoingData, closedData)}
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
  onGoingData: PropTypes.array,  
  closedData: PropTypes.array,  
  data: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  _handleFetchData: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  _handleFetchData: () => { dispatch(actions.fetchData()) },
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
  