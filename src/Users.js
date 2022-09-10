import React from 'react';
import { useSelector } from 'react-redux';

const Users = () => {
  const users = useSelector((state) => state.users);
  const departments = useSelector((state) => state.departments);
  return (
    <ul>
      {users.map((user) => {
        const department = departments.find(
          (department) => department.id === user.departmentId
        );
        return (
          <li key={user.id}>
            {user.name}
            {department ? ` (${department.name})` : null}
          </li>
        );
      })}
    </ul>
  );
};

export default Users;
