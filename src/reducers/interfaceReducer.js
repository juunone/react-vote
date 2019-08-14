import {
  HEADER_TYPE,
  SELECT_ACTION,
  COMPLETE_SELECTED,
  MODIFY_COUNT,
  REMOVE_SELECTED_SURGERY,
  APPLY_DISCOUNT,
  DELETE_SELECTED_DISCOUNT,
  PURCHASE,
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE
} from '../actions/ActionTypes';

const intialState = {
  isPurchasing:false
};

const COPY = (obj) => {
  if (obj !== undefined && obj !== null) {
    return JSON.parse(JSON.stringify(obj));
  }

  return null;
}

const CALC_TOTAL_PRICE = (item) => {
  let calcPrice = 0;
  item.map(v => {
    if(v.discountPrice) calcPrice += (Number(v.discountPrice) * Number(v.count));
    else calcPrice += (Number(v.price) * Number(v.count));
  });
  return calcPrice;
}

export default (state = intialState, action) => { 
    switch (action.type) {
      case HEADER_TYPE:        
        return {
          ...state,
          headerType: action.headerType,
        };
      case SELECT_ACTION:        
        const SELECT_STATE = COPY(state);

        if(action.actionType === 'surgery'){
          SELECT_STATE.products.items[action.key].isSelected = !SELECT_STATE.products.items[action.key].isSelected;
          const totalSelected = Object.keys(SELECT_STATE.products.items).filter(v => SELECT_STATE.products.items[v].isSelected);
          if(totalSelected.length) SELECT_STATE.totalSelectedSurgery = totalSelected.length;
          else SELECT_STATE.totalSelectedSurgery = 0;
        }else if(action.actionType === 'discount'){
          SELECT_STATE.products.discounts[action.key].isSelected = !SELECT_STATE.products.discounts[action.key].isSelected;
          const totalSelected = Object.keys(SELECT_STATE.products.discounts).filter(v => SELECT_STATE.products.discounts[v].isSelected);
          if(totalSelected.length) SELECT_STATE.totalSelectedDiscount = totalSelected.length;
          else SELECT_STATE.totalSelectedDiscount = 0;
        }

        return SELECT_STATE;
      case COMPLETE_SELECTED:
        const COMPLETE_STATE = COPY(state);
        if(action.headerType === 'surgery'){          
          COMPLETE_STATE.totalPrice = 0;
          const totalSurgeryComplete = Object.keys(COMPLETE_STATE.products.items).reduce((results, v) => {
            if(COMPLETE_STATE.products.items[v].isSelected){
              results.push(COMPLETE_STATE.products.items[v]);
              COMPLETE_STATE.totalPrice = Number(COMPLETE_STATE.totalPrice) + Number(COMPLETE_STATE.products.items[v].price);
              COMPLETE_STATE.products.items[v].isSelected = false;
            }
            if(COMPLETE_STATE.selectedDiscount.length)COMPLETE_STATE.selectedDiscount = [];
            return results;
          }, []);

          if(totalSurgeryComplete.length) COMPLETE_STATE.selectedSurgery = totalSurgeryComplete;          
        }else if(action.headerType === 'discount'){
          const totalDiscountComplete = Object.keys(COMPLETE_STATE.products.discounts).reduce((results, v) => {
            if(COMPLETE_STATE.products.discounts[v].isSelected){
              results.push(COMPLETE_STATE.products.discounts[v]);
              COMPLETE_STATE.products.discounts[v].isSelected = false;
            }
            return results;
          }, []);

          if(totalDiscountComplete.length) COMPLETE_STATE.selectedDiscount = totalDiscountComplete;
        }

        COMPLETE_STATE.headerType = 'main';

        return COMPLETE_STATE;
      case MODIFY_COUNT:        
      const COUNT_STATE = COPY(state);
      COUNT_STATE.selectedSurgery[action.key].count = Number(action.val);
      COUNT_STATE.totalPrice = CALC_TOTAL_PRICE(COUNT_STATE.selectedSurgery);
        return COUNT_STATE;
      case REMOVE_SELECTED_SURGERY:
        const REMOVE_SELECTED_SURGERY_STATE = COPY(state);
        REMOVE_SELECTED_SURGERY_STATE.selectedDiscount.map(v => {
          if(v.target === REMOVE_SELECTED_SURGERY_STATE.selectedSurgery[action.key].name){
            v.target = undefined;
          }
        });
        REMOVE_SELECTED_SURGERY_STATE.selectedSurgery.splice(action.key, 1);
        REMOVE_SELECTED_SURGERY_STATE.totalPrice = CALC_TOTAL_PRICE(REMOVE_SELECTED_SURGERY_STATE.selectedSurgery);
        return REMOVE_SELECTED_SURGERY_STATE;
      case APPLY_DISCOUNT:
        const APPLY_DISCOUNT_STATE = COPY(state);
        const RATE = Number(APPLY_DISCOUNT_STATE.selectedDiscount[action.index].rate);
        APPLY_DISCOUNT_STATE.selectedSurgery.filter(v => {
          if (v.name === action.targetName) {
            const CALC_PRICE = Number(v.price) * Number(v.count);
            v.discountPrice = CALC_PRICE - (CALC_PRICE * RATE);
            v.discountName = APPLY_DISCOUNT_STATE.selectedDiscount[action.index].name;
            APPLY_DISCOUNT_STATE.selectedDiscount[action.index].target = v.name;
          }
        });
        APPLY_DISCOUNT_STATE.totalPrice = CALC_TOTAL_PRICE(APPLY_DISCOUNT_STATE.selectedSurgery);
        return APPLY_DISCOUNT_STATE;
      case DELETE_SELECTED_DISCOUNT:
        const DELETE_SELECTED_DISCOUNT_STATE = COPY(state);
        DELETE_SELECTED_DISCOUNT_STATE.selectedSurgery.map(v => {
          if(v.discountName === DELETE_SELECTED_DISCOUNT_STATE.selectedDiscount[action.index].name){
            v.discountName = undefined;
            v.discountPrice = undefined;
          }
        })
        DELETE_SELECTED_DISCOUNT_STATE.selectedDiscount.splice(action.index, 1);
        DELETE_SELECTED_DISCOUNT_STATE.totalPrice = CALC_TOTAL_PRICE(DELETE_SELECTED_DISCOUNT_STATE.selectedSurgery);
        return DELETE_SELECTED_DISCOUNT_STATE;
      case PURCHASE:
        return {
          ...state,
          isPurchasing:true
        };
      case FETCH_PRODUCTS_START:
        return {
          ...state,
          loading: true,
          error: null
        };
      case FETCH_PRODUCTS_SUCCESS:        
        const ITEMS = action.payload.products.items;
        const DISCOUNTS = action.payload.products.discounts;
        let CURRENCY_CODE = state.currency;
        if(action.payload.products.currency_code === 'KRW'){
          CURRENCY_CODE = 'ko-KR';  
        }else if(action.payload.products.currency_code === 'USD'){
          CURRENCY_CODE = 'en-US';
        }

        if(Object.keys(ITEMS).length){
          Object.keys(ITEMS).map(v => {
            if(ITEMS[v].price === 0) return delete ITEMS[v];
            
            ITEMS[v].isSelected = false;
            ITEMS[v].isDiscount = false;
            ITEMS[v].totalCount = 10;
                        
            if(ITEMS[v].name.indexOf('컷') !== -1){
              ITEMS[v].category = '커트';
            }else if(ITEMS[v].name.indexOf('드라이') !== -1){
              ITEMS[v].category = '드라이';
            }else if(ITEMS[v].name.indexOf('펌') !== -1){
              ITEMS[v].category = '펌';
            }else{
              ITEMS[v].category = '기타';
            }

            return ITEMS;
          });
        }

        if(Object.keys(DISCOUNTS).length){
          Object.keys(DISCOUNTS).map(v => {
            DISCOUNTS[v].isSelected = false;

            return DISCOUNTS;
          });
        }

        return {
          ...state,
          currency: CURRENCY_CODE,
          loading: false,
          products: action.payload.products
        };
      case FETCH_PRODUCTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: String(action.payload.error),
          products: []
        };
      default:
        return state;
    }
  }