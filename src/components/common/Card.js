import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'rc-progress';
import moment from 'moment';

class Card extends Component{
  constructor(props){
    super(props);
  }

  _makeHtml(data, type, settingVote) {
    if(data && data.length){
      return (
        data.map(v => {
          let inTime = 0;
          const endAt = moment(v.endedAt).format("lll");
          if(type === 'ongoing'){
            const total = (v.endedAt - v.startedAt);
            const pastTime = (+ new Date - v.startedAt);
            inTime = pastTime / total * 100
          }else if(type === 'closed'){
            inTime = 100;
          }

          return (
            <div key={`${v.id}_key`} className={'container__card'}>
              <div className={'container__background'}></div>
              <div className={'container__symbol'}>
                <FontAwesomeIcon icon={faPoll} color={'#f99ea8'} />
              </div>
              <h3 className={'container__card__title'}>{v.title}</h3>
              {type === 'standing' && <Button className='container__card__button' onClick={()=>{settingVote('setting', v)}}>수정/삭제</Button>} 
              {type === 'ongoing' && <Button className='container__card__button'>투표</Button>} 
              {type === 'closed' && <Button className='container__card__button'>투표</Button>}
              <div className={'container__card__footer'}>
                <Line strokeLinecap="butt" percent={Math.floor(inTime)} strokeWidth="2" strokeColor="#f894a4" />
                <p className={'container__card__author'}>{v.author} / {endAt}</p>
              </div>
            </div>
          )
        })
      )
    }else{
      return null;
    }
  }

  render(){
    const { data, type, settingVote } = this.props;
    return (
      this._makeHtml(data, type, settingVote)
    )
  }
}

Card.propTypes = {
  type: PropTypes.string, 
  data: PropTypes.array,
  settingVote: PropTypes.func
};

export default Card;