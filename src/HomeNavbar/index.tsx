import React from 'react';
import Navbar from 'react-bootstrap/Navbar'

type PropTypes = {
  userName: string|null
};

function HomeNavbar({ userName }: PropTypes) {

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>Virtual Cafeteria</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {userName}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default HomeNavbar;
