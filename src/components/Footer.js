import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

export default class Footer extends Component{
  render(){
    return(
      <div>Vote was made with <FontAwesomeIcon icon={faHeart} color="red" />  by Juunone</div>
    )
  }
}