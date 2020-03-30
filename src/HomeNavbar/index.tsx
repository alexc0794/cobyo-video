import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { UserType } from '../types';

type PropTypes = {
  user: UserType|null
};

function HomeNavbar({ user }: PropTypes) {
  const userName = user ? (user.lastName ? `${user.firstName} ${user.lastName}`: user.firstName) : "";

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>Virtual Cafeteria</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        {user && user.profilePictureUrl && (
          <Navbar.Brand>
            <img src={user.profilePictureUrl} width="25" height="25" alt={userName} />
          </Navbar.Brand>
        )}
        <Navbar.Text>
          {userName}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default HomeNavbar;
