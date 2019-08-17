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

export const fetchData = (method = 'GET', data, path = '') => {
  let id = "";
  if(method === 'PUT' || method === 'DELETE') id = data && data.id;
  let header = {'Content-Type':'application/json', 'Accept': 'application/json'};
  if(data && method !== 'DELETE'){            
    header = {'Content-Type':'application/x-www-form-urlencoded'}
  }  

  const searchParams = (params) => {
    return Object.keys(params).map((key) => {
      if(key === 'contents') return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(params[key]));
      else return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
  }

  return dispatch => {
    dispatch(fetchDataStart());
    return fetch(`/api/votes/${path}${id}`, {
      headers : header,
      method: method && method,
      body: data && method !== 'DELETE' ? searchParams(data) : undefined
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