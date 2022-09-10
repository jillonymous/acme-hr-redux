import { createStore } from 'redux';

const initialState = {
  departments: [],
  users: [],
};

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_USERS') {
    state = { ...state, users: action.users };
  } else if (action.type === 'SET_DEPARTMENTS') {
    state = { ...state, departments: action.departments };
  } else if (action.type === 'NEW_USER') {
    state = { ...state, users: [...state.users, action.user] };
  }
  return state;
};

const store = createStore(reducer);

export default store;
