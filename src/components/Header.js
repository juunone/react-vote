import React, { Component } from 'react';
import moment from 'moment';
import Button from './common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      date: moment().format("YYYY.MM.DD HH:mm")
    }
  }

  render(){
    const { date } = this.state;
    return(
      <header className={'clearfix'}>
        <div className={'container'}>
          <h2 className={'container__title'}>VOTE</h2>
        </div>
        <nav>
          <Button className='nav__button' icon={<FontAwesomeIcon icon={faPlus} />} />
        </nav>
      </header>
    )
  }
}