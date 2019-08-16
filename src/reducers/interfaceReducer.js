import {
  FETCH_DATA_START,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  HEADER_TYPE,
} from '../actions/ActionTypes';

const intialState = {
  data:[],
  loading: false,
  error: null,
};

const COPY = (obj) => {
  if (obj !== undefined && obj !== null) {
    return JSON.parse(JSON.stringify(obj));
  }

  return null;
}

const extractData = (res) => {
  const data = res;
  if(data && data.length){
    const nowDate = new Date().getTime();
    let standingData = [];
    let onGoingData = [];
    let closedData = [];

    data.map(v => {
      if(v.startedAt > nowDate){
        standingData.push(v);
      } else {
        if (v.startedAt < nowDate && v.endedAt > nowDate) {
          onGoingData.push(v);
        } else {
          closedData.push(v);
        }
      }
    });

    return { standingData, onGoingData, closedData };
  }
}

export default (state = intialState, action) => { 
  switch (action.type) {
  case FETCH_DATA_START:
    return {
      ...state,
      loading: true,
      error: null
    };
  case FETCH_DATA_SUCCESS:
    return {
      ...state,
      loading: false,
      data: action.payload.data ? action.payload.data : [],
      ...extractData(action.payload.data)
    };
  case FETCH_DATA_FAILURE:
    return {
      ...state,
      loading: false,
      error: String(action.payload.error),
      data: []
    };
  case HEADER_TYPE:        
    return {
      ...state,
      headerType: action.headerType,
    };
  default:
    return state;
  }
}