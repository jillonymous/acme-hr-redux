import { createRoot } from 'react-dom/client';
import React, { useEffect } from 'react';
import store from './store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Departments from './Departments';
import Users from './Users';

const root = createRoot(document.querySelector('#root'));

const App = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const departments = useSelector((state) => state.departments);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        dispatch({ type: 'SET_USERS', users: response.data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        dispatch({ type: 'SET_DEPARTMENTS', departments: response.data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div>
      <h1>Welcome to Acme HR</h1>
      <div>
        We currently have {users.length} users! We currently have{' '}
        {departments.length} departments!
      </div>
      <main>
        <Departments />
        <Users />
      </main>
    </div>
  );
};

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
