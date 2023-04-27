import React from 'react';
import UserItem from './UserItem';
import { Table } from 'react-bootstrap';

export default function UsersTable({usersList,position,changeList,isDark,removeUser}) {
  return (
    <Table striped bordered hover responsive variant={isDark?'dark':''}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Position</th>
        <th>Remove user</th>
      </tr>
    </thead>
    <tbody>
      {usersList.map(user => <UserItem key={user.id} changeList={changeList} position={position} parametres={user.parametres} removeUser={removeUser}/>)}
    </tbody>
  </Table>
  )
}
