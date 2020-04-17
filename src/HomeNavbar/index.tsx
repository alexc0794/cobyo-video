import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import virtualClubLogo from 'src/images/virtualclublogo.png';
import { UserType } from 'src/types';
import './index.css';

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
        return (
          <img className="virtual-club-logo" src={virtualClubLogo} alt="Virtual Cafeteria" />
        );
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
