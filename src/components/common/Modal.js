import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default class Modal extends Component{
  constructor(props){
    super(props);
    this.state = {
      startedAt: moment(new Date()).add({minutes: 30}).toDate(),
      endedAt: moment(new Date()).add({hours: 1}).toDate(),
      minTime: this._calculateMinTime(new Date()),
      title:"",
      author:"",
      password:"",
      contents:{},  
      formValid:false    
    }
  }

  _save = () => {
    this._handleValidation();    

    const { handleSave } = this.props;
    handleSave();
  }

  _handleValidation() {
    if(this.state.formValid !== true) return;
  }

  _calculateMinTime = date => {
    let isToday = moment(date).isSame(moment(), 'day');
    if (isToday) {
        let nowAddOneHour = moment(new Date()).add({minutes: 20}).toDate();
        return nowAddOneHour;
    }
    return moment().startOf('day').toDate();
  }

  _handleStartedDateChange = (date) => {
    this.setState({
      startedAt:date,
      minTime: this._calculateMinTime(date),
    })
  }

  _handleEndedDateChange = (date) => {
    this.setState({
      endedAt:date,
      minTime: this._calculateMinTime(date),
    })
  }
  
  _handleUserInput = (e,i) => {
    const name = e.target.name;
    const value = e.target.value;
    const contents = {...this.state.contents}
    contents[`value-${i}`] = e.target.value;

    if(i) this.setState({contents});
    else this.setState({[name]: value});
  }

  _makeVoteContent(cnt) {
    let arr = [];
    for(let i = 0; i < cnt; i++){
      arr.push(<input key={i} type="text" name="contents" placeholder="항목 입력" maxLength="10" 
      value={this.state.contents[`value-${i+1}`] || ''} onChange={(event) => this._handleUserInput(event,i+1)} />);
    }
    return arr;
  }

  render(){
    const {type, voteCnt, onClose, addContent, closeModal} = this.props;
    return(      
      <div className={'modal'}>
        <div className={'modal__main'}>
          <label className={'label__alone'}>
            <input type="text" autoComplete='off' id="title" name="title" placeholder="제목" maxLength="15" value={this.state.title} onChange={(event) => this._handleUserInput(event)} />
          </label>
          <label className={'label__alone'}>
            <input 
              type="text" 
              autoComplete='off' 
              id="author" 
              name="author" 
              placeholder="작성자"               
              maxLength="10" 
              disabled={type === 'create' ? false : true}
              value={this.state.author} 
              onChange={(event) => this._handleUserInput(event)}
            />
          </label>
          <label className={'label__alone'}>
            <input type="password" autoComplete='off' id="password" name="password" placeholder="비밀번호" value={this.state.password} onChange={(event) => this._handleUserInput(event)} />
          </label>
          <label className={'label__text'}>
            {this._makeVoteContent(voteCnt)}
          </label>
          <Button className={'add__button'} onClick={(()=>{addContent()})} style={{display: type === 'create' ? 'block' : 'none'}}>
            <FontAwesomeIcon icon={faPlus} /> 항목 추가
          </Button>
          <div className={'modal_datepicker clearfix'}>
            <div className={'datepicker__title'}>시작</div>
            <DatePicker
              mode="time"
              selected={this.state.startedAt}
              showTimeSelect
              dateFormat="yyyy.MM.dd HH:mm"
              onChange={this._handleStartedDateChange}
              minDate={moment().toDate()}
              minTime={this.state.minTime}
              maxTime={moment().endOf('day').toDate()}
            />                
          </div>
          <div className={'modal_datepicker clearfix'}>
            <div className={'datepicker__title'}>종료</div>
            <DatePicker
              selected={this.state.endedAt}
              showTimeSelect
              dateFormat="yyyy.MM.dd HH:mm"
              onChange={this._handleEndedDateChange}
              minDate={moment().toDate()}
              minTime={moment(this.state.minTime).add({hours: 1}).toDate()}
              maxTime={moment().endOf('day').toDate()}
            />
          </div>
        </div>
        <div className={"modal__footer"}>
          <Button className={'default__button'} onClick={(()=>{closeModal(onClose)})}>닫기</Button>
          <Button className={'nav__button'} onClick={(()=>{this._save(onClose)})}>저장</Button>
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  type: PropTypes.string, 
  voteCnt: PropTypes.number, 
  onClose: PropTypes.func, 
  addContent: PropTypes.func, 
  closeModal: PropTypes.func
};