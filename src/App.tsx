import React, { Component } from 'react';
import HomeNavbar from './HomeNavbar';
import NameModal from './NameModal';
import Cafeteria from './Cafeteria';
import VideoHangout from './VideoHangout';
import { getRTC, RTCType } from './AgoraRTC';
import { hashCode } from './helpers';
import { TableType } from './types';
import { connect } from 'react-redux';
import { selectJoinedTable } from './redux/tablesSelectors';

let rtc: RTCType = getRTC();

type PropTypes = {
  joinedTable: TableType|null,
};

type StateTypes = {
  userId: string|null,
  userName: string|null,
  showModal: boolean,
}

class App extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      userId: null,
      userName: null,
      showModal: true,
    };
  }

  handleEnterName = (name: string) => {
    const hash = hashCode(name).toString();
    const userId = hash.slice(hash.length - 4); // userId must be between 1-10000 :(
    this.setState({ userId, userName: name, showModal: false });
  };

  render() {
    const { joinedTable } = this.props;
    const { showModal, userId, userName } = this.state;
    const { handleEnterName } = this;

    return (
      <div id="App" className="App">
        {showModal && <NameModal onEnterName={handleEnterName} />}
        {!!joinedTable && !!userId && (
          <VideoHangout userId={userId} tableId={joinedTable.tableId} rtc={rtc} />
        )}
        {!joinedTable && (
          <>
            <HomeNavbar userName={userName} />
            <Cafeteria userId={userId} />
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  joinedTable: selectJoinedTable(state)
});

export default connect(
  mapStateToProps,
)(App);
