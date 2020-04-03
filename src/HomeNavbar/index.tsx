import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { UserType } from '../types';

type PropTypes = {
  user: UserType|null,
  storefront: string|null,
  status: string,
};

function HomeNavbar({ user, storefront }: PropTypes) {
  const userName = user ? (user.lastName ? `${user.firstName} ${user.lastName}`: user.firstName) : "";
  const title = (() => {
    switch (storefront) {
      case 'CAFE':
        return 'Virtual Cafe';
      case 'CAFETERIA':
        return 'Virtual Cafeteria';
      case 'CLUB':
        return 'Virtual Club';
      default:
        return null;
    }
  })();

  if (!title) {
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>{title}</Navbar.Brand>
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
