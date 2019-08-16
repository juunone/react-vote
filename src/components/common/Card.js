import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPoll } from '@fortawesome/free-solid-svg-icons'

class Card extends Component{
  constructor(props){
    super(props);
  }

  _makeHtml(data, type, settingVote) {
    if(data && data.length){
      return (
        data.map(v => {
          return (
            <div key={`${v.id}_key`} className={'container__card'}>
              <div className={'container__background'}></div>
              <div className={'container__symbol'}>
                <FontAwesomeIcon icon={faPoll} color={'red'} />
              </div>
              <h3 className={'container__card__title'}>{v.title}</h3>
              {type === 'standing' && <Button className='container__card__button' onClick={()=>{settingVote('setting', v)}}>수정/삭제</Button>} 
              {type === 'ongoing' && <Button className='container__card__button'>VOTE</Button>} 
              {type === 'closed' && <Button className='container__card__button'>VOTE</Button>} 
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