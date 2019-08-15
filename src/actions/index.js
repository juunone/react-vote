import * as types from './ActionTypes'

export const fetchDataStart = () => {
  return{
    type: types.FETCH_DATA_START
  }
};

export const fetchDataSuccess = data => {
  return{
    type: types.FETCH_DATA_SUCCESS,
    payload: { data }
  }
};

export const fetchDataFailure = error => {
  return{
    type: types.FETCH_DATA_FAILURE,
    payload: { error }
  }
};

export const fetchData = () => {
  return dispatch => {
    dispatch(fetchDataStart());
    return fetch("/api/votes", {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(handleErrors)
      .then(res => {
        return res.json()
      })
      .then(json => {
        dispatch(fetchDataSuccess(json));
      })
      .catch(error => dispatch(fetchDataFailure(error)));
  };
}

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const getHeaderItems = (headerType) => {
  return{
    type:types.HEADER_TYPE,
    headerType: headerType
  }
}