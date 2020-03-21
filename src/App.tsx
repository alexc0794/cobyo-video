import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import NameModal from './NameModal';
import Cafeteria from './Cafeteria';
import GroupVideo from './GroupVideo';
import { getRTC, RTCType, AGORA_APP_ID } from './AgoraRTC';
import { fetchToken, fetchTable, updateTableWithUserIdsFromRtc } from './services';
import { hashCode } from './helpers';
import { TableType } from './types';

let rtc: RTCType = getRTC();

type PropTypes = {};

type StateTypes = {
  userId: string|null,
  showModal: boolean,
  joinedTable: TableType|null,
}

class App extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      userId: null,
      showModal: true,
      joinedTable: null,
    };
  }

  componentDidMount() {
    rtc.client.on("user-published", this.handleUserPublish);
    rtc.client.on("user-unpublished", this.handleUserUnpublish);
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
    const { joinedTable } = this.state;
    if (!joinedTable) { return; }
    try {
      const table: TableType = await fetchTable(joinedTable.tableId);
      this.setState({ joinedTable: table });
    } catch (e) {
      console.warn(e);
    }
  };

  handleUserUnpublish = async (user: any) => {
    // When someone leaves, both our local state and our server state are out-of-date, so take the users on the stream and
    // first update the table on the server, then when successful update table in local state.
    const { userId, joinedTable } = this.state;
    if (!userId || !joinedTable) { return; }
    try {
      const userIds = [...rtc.client.remoteUsers.map(user => user.uid.toString()), userId];
      const table: TableType = await updateTableWithUserIdsFromRtc(joinedTable.tableId, userIds);
      this.setState({ joinedTable: table });
    } catch (e) {
      console.error(e);
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
    const userIds = [...rtc.client.remoteUsers.map(user => user.uid.toString()), userId];
    const updatedTable: TableType = await updateTableWithUserIdsFromRtc(table.tableId, userIds);
    this.setState({ joinedTable: updatedTable });

    // This is a hack
    setTimeout(() => {
      if (rtc && rtc.localVideoTrack) {
        // Make sure client isn't joining a second time otherwise there will be duplicate camera windows.
        rtc.localVideoTrack.play(`video-${userId}`);
      }
    }, 2000);
  };

  handleEnterName = (name: string) => {
    const hash = hashCode(name).toString();
    const userId = hash.slice(hash.length - 4); // userId must be between 1-10000 :(
    this.setState({ userId, showModal: false });
  };

  render() {
    const { showModal, joinedTable, userId } = this.state;
    const { handleEnterName, handleJoinTable } = this;

    return (
      <div id="App" className="App">
        {showModal && (
          <NameModal onEnterName={handleEnterName} />
        )}
        {!!joinedTable && !!userId && (
          <GroupVideo userId={userId} table={joinedTable} />
        )}
        <Cafeteria
          userId={userId}
          onJoin={handleJoinTable}
          rtc={rtc}
        />
      </div>
    );
  }
}

export default App;
