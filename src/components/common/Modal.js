import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { FormErrors } from './FormErrors';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUser, faCheck, faVoteYea } from '@fortawesome/free-solid-svg-icons'

export default class Modal extends Component{
  constructor(props){
    super(props);
    this.state = {
      categoryLimit: 6,
      voteCnt: this.props.data ? Object.keys(this.props.data.contents).length : 3,
      startedAt: this.props.data ? this.props.data.startedAt : moment(new Date()).add({minutes: 30}).toDate(),
      endedAt: this.props.data ? this.props.data.endedAt : moment(new Date()).add({hours: 1}).toDate(),
      minTime: this._calculateMinTime(new Date()),
      title: this.props.data ? this.props.data.title : "",
      author: this.props.data? this.props.data.author : "",
      password:"",
      contents: this.props.data ? this.props.data.contents : {},
      titleValid: this.props.data ? true : false,
      authorValid: this.props.data ? true : false,
      passwordValid: false,
      contentsValid: this.props.data ? true : false,
      startedAtValid: true,
      endedAtValid: true,
      formValid: false,
      formErrors: {title:'', author: '', password:'', contents:'', contentsObj: this.props.data ? this.props.data.contents : {}, startedAt:'', endedAt: ''}
    }
  }

  _delete = (onClose) => {
    const { handleDelete, data } = this.props;
    const { password } = this.state;

    const id = {
      id: this.props.data && this.props.data.id
    }

    if(data.password === password){
      if(confirm('정말 삭제하시겠습니까?')){
        handleDelete(onClose, id);
      }
    } 
    else return alert('비밀번호가 일치하지 않습니다.');
  };

  _save = (onClose) => {
    const { type, handleSave } = this.props;
    const { title, author, password, contents, startedAt, endedAt } = this.state;
    const data = {
      id: this.props.data && this.props.data.id,
      title:title,
      author:author,
      password:password,
      contents:contents,
      startedAt: typeof startedAt !== 'number' ? startedAt.getTime() : startedAt,
      endedAt: typeof endedAt !== 'number' ? endedAt.getTime() : endedAt
    };

    if(type === 'create' && this.state.formValid === true){
      handleSave(onClose, data);
    } else if(this.props.data.password === password && this.state.formValid === true) {
      handleSave(onClose, data);
    }else{
      return alert('비밀번호가 일치하지 않습니다.');
    }
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
      endedAt:moment(date).add({hours: 1}).toDate(),
      minTime: this._calculateMinTime(date),
    }, () => {this._validateField('startedAt', date)} )
  }

  _handleEndedDateChange = (date) => {
    this.setState({
      endedAt:date,
      minTime: this._calculateMinTime(date),
    }, () => {this._validateField('endedAt', date)} )
  }
  
  _handleUserInput = (e,i) => {
    const name = e.target.name;
    const value = e.target.value;
    const contents = {...this.state.contents}
    if(!contents[`category-${i}`]) contents[`category-${i}`] = {};
    contents[`category-${i}`].value = e.target.value;
    contents[`category-${i}`].voter = [];

    if(i){
      this.setState({
        contents
      }, () => {this._validateField('contents', value, i)});
    } else {
      this.setState({
        [name]: value
      }, () => {this._validateField(name, value)});
    }
  }

  _validateField(fieldName, value, index) {
    let fieldValidationErrors = this.state.formErrors;
    let titleValid = this.state.titleValid;
    let authorValid = this.state.authorValid;
    let passwordValid = this.state.passwordValid;
    let contentsValid = this.state.contentsValid;
    let startedAtValid = this.state.startedAtValid;
    let endedAtValid = this.state.endedAtValid;
  
    switch(fieldName) {
    case 'title':
      titleValid = value.match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|*]+$/);
      fieldValidationErrors.title = titleValid ? '' : '특수문자를 제외한 한글,영문,숫자만 입력 가능합니다.';
      break;
    case 'author':
      authorValid = value.match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|*]+$/);
      fieldValidationErrors.author = authorValid ? '': '특수문자를 제외한 한글,영문,숫자만 입력 가능합니다.';
      break;
    case 'password':
      passwordValid = value.match(/^[a-z|A-Z|0-9|*]+$/);
      fieldValidationErrors.password = passwordValid ? '': '특수문자를 제외한 영문,숫자만 입력 가능합니다.';
      break;
    case 'contents':
      contentsValid =  true;
      if(!fieldValidationErrors.contentsObj[`category-${index}`]) fieldValidationErrors.contentsObj[`category-${index}`] = {};
      fieldValidationErrors.contentsObj[`category-${index}`].value = value;
      fieldValidationErrors.contentsObj[`category-${index}`].voter = [];
      Object.keys(fieldValidationErrors.contentsObj).forEach((v)=>{
        if(this.state.voteCnt !== Object.keys(fieldValidationErrors.contentsObj).length){
          contentsValid = false;
        }else if(fieldValidationErrors.contentsObj[v].value === ""){          
          contentsValid = false;
        }
      });
      fieldValidationErrors.contents = contentsValid ? '': '항목을 모두 입력해주세요.';
      break;
    case 'startedAt':
      startedAtValid = value !== null;
      fieldValidationErrors.startedAt = startedAtValid ? '': '시작일을 선택해주세요.';
      break;
    case 'endedAt':
      endedAtValid = value !== null;
      fieldValidationErrors.endedAt = endedAtValid ? '': '종료일을 선택해주세요.';
      break;
    default:
      break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      titleValid: titleValid,
      authorValid: authorValid,
      passwordValid: passwordValid,
      contentsValid: contentsValid,
      startedAtValid: startedAtValid,
      endedAtValid: endedAtValid
    }, this._validateForm);
  }
  
  _validateForm() {
    let contentsValid = true;
    let fieldValidationErrors = this.state.formErrors;
    if(Object.keys(fieldValidationErrors.contentsObj).length){
      Object.keys(fieldValidationErrors.contentsObj).forEach((v)=>{
        if(this.state.voteCnt !== Object.keys(fieldValidationErrors.contentsObj).length){
          contentsValid = false;
        }else if(fieldValidationErrors.contentsObj[v].value === ""){
          contentsValid = false;
        }
      });
    }else{
      contentsValid = false;
    }

    this.setState({
      formValid : 
        this.state.titleValid && 
        this.state.authorValid &&
        this.state.passwordValid &&
        contentsValid &&
        this.state.startedAtValid &&
        this.state.endedAtValid
    });
  }

  _makeVoteContent(cnt) {
    let arr = [];
    for(let i = 0; i < cnt; i++){
      arr.push(
        <input key={i} 
          type="text" 
          className={`form-group__${this._errorLog(this.state.formErrors.contents)}`} 
          name="contents" 
          placeholder="항목 입력" 
          maxLength="10" 
          autoComplete="off"
          value={this.state.contents[`category-${i+1}`] ? this.state.contents[`category-${i+1}`].value : ''} 
          onChange={(event) => this._handleUserInput(event,i+1)} 
        />
      );
    }
    return arr;
  }

  _makeResults() {
    const { data } = this.props;
    const contents = data.contents;
    const categoryResult = () => {
      return Object.keys(contents).map((v)=>{
        const leng = contents[v].voter.length;
        const voterList = contents[v].voter.join(', ');
        return( 
          <div key={v} className={leng === data.topAcquisitionVote ? 'categories top' : 'categories'}>
            <div className={'categories__contents clearfix'}>
              <p className={'value'}>
                {leng === data.topAcquisitionVote && <FontAwesomeIcon icon={faCheck} size={'xs'} /> }
                <b>{contents[v].value}</b>
              </p>
              <p className={'voter'}>
                <FontAwesomeIcon icon={faVoteYea} size={'xs'} /> 
                <b>{leng}</b>
              </p>
            </div>
            {leng !== 0 && (
              <p className={'voter__list'}>
                <FontAwesomeIcon icon={faUser} size={'xs'} /> : {voterList}
              </p>
            )}
          </div>
        )
      });
    };

    return(
      <div className={'container'}>
        <h2 className={'title'}>{data.title}</h2>
        <div className={'date'}>
          <p>시작: {moment(data.startedAt).format('lll')}</p>
          <p>종료: {moment(data.endedAt).format('lll')}</p>
        </div>
        {categoryResult()}
        <label className={'label__alone'}>
          <input 
            type="password" 
            className={`password form-group__${this._errorLog(this.state.formErrors.password)}`} 
            autoComplete='off' 
            id="password" 
            name="password" 
            placeholder="비밀번호" 
            value={this.state.password} 
            onChange={(event) => this._handleUserInput(event)} 
          />
        </label>
      </div>
    )
  }

  _errorLog(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  _addContent() {
    const newCnt = this.state.voteCnt;
    if(newCnt >= this.state.categoryLimit){
      return;
    } else {
      this.setState({
        voteCnt: newCnt + 1
      });
    }    
  }

  render(){
    const {type, onClose} = this.props;
    return(      
      <div className={'modal'}>
        {type === 'create' || type === 'setting' ? (
          <div className={'modal__main'}>
            <label className={'label__alone'}>
              <input 
                type="text" 
                className={`form-group__${this._errorLog(this.state.formErrors.title)}`} 
                autoComplete='off' 
                id="title" 
                name="title" 
                placeholder="제목" 
                maxLength="15" 
                value={this.state.title} 
                onChange={(event) => this._handleUserInput(event)} 
              />
              <FormErrors formErrors={this.state.formErrors.title} />
            </label>
            <label className={'label__alone'}>
              <input 
                type="text" 
                className={`form-group__${this._errorLog(this.state.formErrors.author)}`} 
                autoComplete='off' 
                id="author" 
                name="author" 
                placeholder="작성자"               
                maxLength="10" 
                disabled={type === 'create' ? false : true}
                value={this.state.author} 
                onChange={(event) => this._handleUserInput(event)}
              />
              <FormErrors formErrors={this.state.formErrors.author} />
            </label>
            <label className={'label__alone'}>
              <input 
                type="password" 
                className={`form-group__${this._errorLog(this.state.formErrors.password)}`} 
                autoComplete='off' 
                id="password" 
                name="password" 
                placeholder="비밀번호" 
                value={this.state.password} 
                onChange={(event) => this._handleUserInput(event)} 
              />
              <FormErrors formErrors={this.state.formErrors.password} />
            </label>
            <label className={'label__text'}>
              {this._makeVoteContent(this.state.voteCnt)}
              <FormErrors formErrors={this.state.formErrors.contents} />
            </label>
            <label className={'label__button'} style={{display: this.state.voteCnt >= this.state.categoryLimit ? 'none' : 'block'}}>
              <Button className={'add__button'} onClick={(()=>{this._addContent()})}>
                <FontAwesomeIcon icon={faPlus} /> 항목 추가
              </Button>
            </label>
            <div className={'modal_datepicker clearfix'}>
              <div className={'datepicker__title'}>시작</div>
              <DatePicker
                mode="time"
                selected={this.state.startedAt}
                className={`form-group__${this._errorLog(this.state.formErrors.startedAt)}`} 
                showTimeSelect
                dateFormat="yyyy.MM.dd HH:mm"
                onChange={this._handleStartedDateChange}
                minDate={moment().toDate()}
                minTime={this.state.minTime}
                maxTime={moment().endOf('day').toDate()}
              />                
              <FormErrors formErrors={this.state.formErrors.startedAt} />
            </div>
            <div className={'modal_datepicker clearfix'}>
              <div className={'datepicker__title'}>종료</div>
              <DatePicker
                selected={this.state.endedAt}
                className={`form-group__${this._errorLog(this.state.formErrors.endedAt)}`} 
                showTimeSelect
                dateFormat="yyyy.MM.dd HH:mm"
                onChange={this._handleEndedDateChange}
                minDate={moment().toDate()}
                minTime={moment(this.state.minTime).add({hours: 1}).toDate()}
                maxTime={moment().endOf('day').toDate()}
              />
              <FormErrors formErrors={this.state.formErrors.endedAt} />
            </div>
          </div>
        ) : (type === "result" ? (
          <div className={'modal__results'}>
            {this._makeResults()}
          </div>
        ) : (
          <div>1231312</div>
        )
        )}
        <div className={"modal__footer"}>
          <Button className={'default__button'} onClick={(()=>{onClose()})}>닫기</Button>
          {type !== 'result' && <Button className={'nav__button'} onClick={(()=>{this._save(onClose)})} disabled={!this.state.formValid}>저장</Button>}
          {type === 'setting' || type === 'result' ? <Button className={'delete__button'} onClick={(()=>{this._delete(onClose)})} disabled={!this.state.formValid}>삭제</Button> : null}
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  data: PropTypes.object, 
  type: PropTypes.string, 
  onClose: PropTypes.func, 
  handleSave: PropTypes.func,
  handleDelete: PropTypes.func
};