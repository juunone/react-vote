import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Line from './Line';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

class Card extends Component{
  constructor(props){
    super(props);
    this.state = {
      percent: this.props.type !== 'ongoing' ? (this.props.type === 'staging' ? 0 : 100 ) : this._calcPercent(),
      delay:1000
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this._frame(), this.state.delay);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _frame() {
    if (this.state.percent < 100){
      this.setState({
        percent: this._calcPercent()
      });      
    }
  }

  _calcPercent() {    
    const { type, data } = this.props;
    let inTime = 0;
    if(type === 'ongoing'){
      const total = (data.endedAt - data.startedAt);
      const pastTime = (+ new Date - data.startedAt);
      inTime = pastTime / total * 100
    }else if(type === 'closed'){
      inTime = 100;
    }
    
    return Math.floor(inTime);
  }

  _makeHtml(data, type, settingVote, resultVote) {
    if(data){  
      const endAt = moment(data.endedAt).format("lll");         
      return (
        <> 
          <div className={'container__background'}></div>
          <div className={'container__symbol'}>
            <FontAwesomeIcon icon={faPoll} color={'#f99ea8'} />
          </div>
          <h3 className={'container__card__title'}>{data.title}</h3>
          {type === 'staging' && <Button className='container__card__button' onClick={()=>{settingVote('setting', data)}}>수정/삭제</Button>} 
          {type === 'ongoing' && <Button className='container__card__button'>투표</Button>} 
          {type === 'closed' && <Button className='container__card__button' onClick={()=>{resultVote('result', data)}}>결과보기</Button>}
          <div className={'container__card__footer'}>
            <Line className={'progress red'} percent={this.state.percent} />
            <p className={'container__card__author'}>{data.author} / {endAt}</p>
          </div>
        </>
      )
    }else{
      return null;
    }
  }

  render(){
    const { data, type, settingVote, resultVote } = this.props;
    return (
      this._makeHtml(data, type, settingVote, resultVote)
    )
  }
}

Card.propTypes = {
  type: PropTypes.string, 
  data: PropTypes.object,
  settingVote: PropTypes.func,
  endedAt: PropTypes.number
};

export default Card;