import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import NameModal from './NameModal';
import Cafeteria from './Cafeteria';
import GroupVideo from './GroupVideo';
import { getRTC, RTCType, AGORA_APP_ID } from './AgoraRTC';
import { hashCode } from './helpers';
import { TableType } from './types';
import { fetchToken } from './services';
import { connect } from 'react-redux';
import { fetchAndUpdateTable, joinAndUpdateTable, updateTableWithRTC } from './redux/tablesActions';
import { selectJoinedTable } from './redux/tablesSelectors';

let rtc: RTCType = getRTC();

type PropTypes = {
  joinedTable: TableType|null,
  fetchAndUpdateTable: (tableId: string) => Promise<void>,
  joinAndUpdateTable: (tableId: string, seat: number, userId: string) => Promise<void>,
  updateTableWithRTC: (tableId: string, rtc: RTCType, userId: string|null) => Promise<void>
};

type StateTypes = {
  userId: string|null,
  showModal: boolean,
}

class App extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      userId: null,
      showModal: true,
    };
  }

  componentDidMount() {
    rtc.client.on("user-published", this.handleUserPublish);
    rtc.client.on("user-unpublished", this.handleUserUnpublish);
  }

  async componentDidUpdate(prevProps: PropTypes) {
    const prevJoinedTableId = prevProps.joinedTable ? prevProps.joinedTable.tableId : null;
    const currJoinedTableId = this.props.joinedTable ? this.props.joinedTable.tableId : null
    const didTableChange = prevJoinedTableId !== currJoinedTableId;
    const { userId } = this.state;
    const { joinedTable } = this.props;
    if (didTableChange && !!joinedTable && userId) {
      await this.handleJoinTable(joinedTable, userId);
    } else if (didTableChange && !joinedTable && userId) {
      this.handleLeaveTable();
    }
  }

  handleUserPublish = async (user: any, media: string) => {
    await rtc.client.subscribe(user);
    const newUserId = user.uid.toString();
    const remoteAudioTrack = user.audioTrack;
    const remoteVideoTrack = user.videoTrack;

    // Hack for now
    setTimeout(() => {
      if (remoteVideoTrack) {
        remoteVideoTrack.play(`video-${newUserId}`);
      }
      if (remoteAudioTrack) {
        remoteAudioTrack.play();
      }
    }, 2000);

    // When someone joins, our local state of the table is now out-of-date, so re-fetch the table and update local state.
    const { fetchAndUpdateTable, joinedTable } = this.props;
    if (joinedTable) {
      await fetchAndUpdateTable(joinedTable.tableId);
    }
  };

  handleUserUnpublish = async (user: any) => {
    // When someone leaves, both our local state and our server state are out-of-date, so take the users on the stream and
    // first update the table on the server, then when successful update table in local state.
    const { joinedTable, updateTableWithRTC } = this.props;
    const { userId } = this.state;
    if (joinedTable) {
      updateTableWithRTC(joinedTable.tableId, rtc, userId);
    }
  }

  handleJoinTable = async (table: TableType, userId: string) => {
    const token = await fetchToken(userId);
    try {
      await rtc.client.join(
        AGORA_APP_ID,
        "channelName", // TODO, channel should be based on tableId
        token,
        parseInt(userId, 10), // Must be an int, otherwise token invalidates :(
      );
    } catch (e) {
      console.error(e); // TODO: Error handling
      return;
    }

    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    await rtc.client.publish([
      rtc.localAudioTrack,
      rtc.localVideoTrack
    ]);

    // When I join the chat, I want to check the remote users of the stream and update
    // 1. Table in the server --> database is up-to-date
    // 2. Table in my client's local state --> correct div's render on my screen
    this.props.updateTableWithRTC(table.tableId, rtc, userId);

    // This is a hack
    setTimeout(() => {
      if (rtc && rtc.localVideoTrack) {
        // Make sure client isn't joining a second time otherwise there will be duplicate camera windows.
        rtc.localVideoTrack.play(`video-${userId}`);
      }
    }, 2000);
  };

  handleLeaveTable = async () => {
    if (rtc.localAudioTrack) {
      rtc.localAudioTrack.close();
    }
    if (rtc.localVideoTrack) {
      rtc.localVideoTrack.close();
    }
    await rtc.client.leave();

  };

  handleEnterName = (name: string) => {
    const hash = hashCode(name).toString();
    const userId = hash.slice(hash.length - 4); // userId must be between 1-10000 :(
    this.setState({ userId, showModal: false });
  };

  render() {
    const { joinedTable } = this.props;
    const { showModal, userId } = this.state;
    const { handleEnterName } = this;

    return (
      <div id="App" className="App">
        {showModal && (
          <NameModal onEnterName={handleEnterName} />
        )}
        {!!joinedTable && !!userId && (
          <GroupVideo userId={userId} table={joinedTable} />
        )}
        <Cafeteria userId={userId} />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  joinedTable: selectJoinedTable(state)
});

const mapDispatchToProps = {
  fetchAndUpdateTable,
  joinAndUpdateTable,
  updateTableWithRTC
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
