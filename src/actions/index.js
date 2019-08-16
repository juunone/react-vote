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

export const fetchData = (method = 'GET', data) => {
  let header = {'Content-Type':'application/json', 'Accept': 'application/json'};
  if(data && method !== 'DELETE'){            
    header = {'Content-Type':'application/x-www-form-urlencoded'}
  }  
  return dispatch => {
    dispatch(fetchDataStart());
    return fetch(`/api/votes/${data ? data.id : ''}`, {
      headers : header,
      method: method && method,
      body: data && method !== 'DELETE' ? 
        `author=${data.author}&title=${data.title}&password=${data.password}&contents=${JSON.stringify(data.contents)}&startedAt=${data.startedAt}&endedAt=${data.endedAt}` : 
        undefined
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