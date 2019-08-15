import React, { Component } from 'react';
import Button from './common/Button';
import Title from './common/Title';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default class Header extends Component{
  constructor(props){
    super(props);
  }

  createVote(){
    return (
      confirmAlert({
        closeOnEscape: true,
        closeOnClickOutside: true,
        customUI: ({ onClose }) => {
          return (
            <div className={'modal'}>
              <div>
                <label htmlFor="title">
                  <input type="text" id="title" name="title" placeholder="Title" />
                </label>
                <label>
                  <input type="text" name="vote1" placeholder="항목 입력" />
                  <input type="text" name="vote2" placeholder="항목 입력" />
                  <input type="text" name="vote3" placeholder="항목 입력" />
                </label>
              </div>
              <div className={"modal__footer"}>
                <Button className={'default__button'} onClick={onClose}>Close</Button>
                <Button className={'nav__button'} onClick={onClose}>Create</Button>
              </div>
            </div>
          )
        }      
      })
    )
  }

  render(){
    return(
      <header className={'clearfix'}>
        <div className={'container'}>
          <Title className="container__title">VOTE</Title>
        </div>
        <nav>
          <Button onClick={(()=>{this.createVote()})} className='nav__button'>
            <FontAwesomeIcon icon={faPlus} /> Create Vote
          </Button>
        </nav>
      </header>
    )
  }
}