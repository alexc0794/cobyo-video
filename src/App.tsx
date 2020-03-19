import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { getRTC, AGORA_APP_ID } from './AgoraRTC';
import HeaderAlert from './HeaderAlert';
import NameModal from './NameModal';
import SeatPicker from './SeatPicker';
import SeatViewGroupVideo, { User, SeatViewGroupVideoPropTypes } from './SeatViewGroupVideo';
import { fetchToken, fetchTable, joinTable, updateTable } from './services';
import { hashCode } from './helpers';
import { getSeatNumber } from './seatNumberHelpers';
import { Table } from './types';

type PropTypes = {};

type StateTypes = {
  userId: string,
  userName: string,
  hasJoined: boolean,
  showModal: boolean,
  table: Table | null,
}

const rtc = getRTC();

const tableId = "1"; // TODO: Dont hardcode

class App extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      userId: "",
      userName: "",
      hasJoined: false,
      showModal: true,
      table: null,
    };
  }

  componentDidMount() {
    rtc.client.on("connection-state-change", (curState, revState, reason) => {});
    rtc.client.on("user-published", this.onUserPublish);
    rtc.client.on("user-unpublished", this.onUserUnpublish);
  }

  onUserPublish = async (user: any, mediaType: string) => {
    // Subscribe to a remote user
    await rtc.client.subscribe(user);
    const newUserId = user.uid.toString();
    // Get `RemoteAudioTrack` and `RemoteVideoTrack` in the `user` object.
    const remoteAudioTrack = user.audioTrack;
    const remoteVideoTrack = user.videoTrack;

    if (!remoteAudioTrack || !remoteVideoTrack) {
      return;
    }

    try {
      const table: Table = await fetchTable(tableId);
      this.setTableWithRemoteUsers(table);
    } catch (e) {
      console.warn(e);
    }

    // This a hack
    setTimeout(() => {
      // Play the remote audio and video tracks
      // Pass the ID of the DIV container and the SDK dynamically creates a user in the container for playing the remote video track
      remoteVideoTrack.play(`video-${newUserId}`);
      // Play the audio track. Do not need to pass any DOM element
      remoteAudioTrack.play();
    }, 2000);
  }

  onUserUnpublish = (unpublishedUser: any) => {
    const { table } = this.state;
    if (table) {
      this.setTableWithRemoteUsers(table);
    }
  }

  refreshTable = async () => {
    try {
      const table: Table = await fetchTable(tableId);
      this.setState({ table });
    } catch {
      console.error("Can't find table");
    }
  };

  setTableWithRemoteUsers = (table: Table) => {
    const remoteUserIds = rtc.client.remoteUsers.map(remoteUser => remoteUser.uid.toString());
    remoteUserIds.push(this.state.userId);
    console.log(remoteUserIds);
    console.log('before publish', table.seats);
    table.seats = table.seats.map(seat => {
      if (seat && remoteUserIds.includes(seat.userId)) {
        return seat;
      }
      return null;
    });
    console.log('after publish', table.seats);
    updateTable(table.tableId, table.seats, table.name);
    this.setState({ table });
  };

  handleClickJoin = async (seatNumber: number) => {
    const isAlreadyConnected = rtc.client.connectionState === 'CONNECTED';
    if (isAlreadyConnected) {
      // TODO: Switch channels
      alert("Not yet implemented");
      return;
    }

    const { userId } = this.state;
    let table: Table;
    try {
      table = await joinTable(tableId, seatNumber, userId);
    } catch {
      // TODO: Error handling
      return;
    }

    let token;
    try {
      token = await fetchToken(userId);
    } catch {
      // TODO: Error handling
      alert("No token found. Alex probably fucked up.");
      return;
    }

    try {
      await rtc.client.join(
        AGORA_APP_ID,
        "channelName", // TODO
        token,
        parseInt(userId, 10), // Must be an int, otherwise token invalidates :(
      );
    } catch (e) {
      // TODO: Error handling
      return;
    }

    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // When I join a table, update the backend with the users actually on the stream.
    this.setTableWithRemoteUsers(table);

    // TODO: Move this to GroupChat component
    setTimeout(() => {
      if (rtc && rtc.localVideoTrack) {
        // Make sure client isn't joining a second time otherwise there will be duplicate camera windows.
        rtc.localVideoTrack.play(`video-${userId}`);
      }
    }, 2000);

    await rtc.client.publish([
      rtc.localAudioTrack,
      rtc.localVideoTrack
    ]);

    this.setState({ hasJoined: true });
  }

  handleEnterName = async (name: string) => {
    // TODO: THIS IS A BIG HACK!!!! USER IDS WILL EVENTUALLY COLLIDE!!!
    // userId must be between 1-10000 :(
    const hash = hashCode(name).toString();
    let userId = hash.slice(hash.length - 4);
    this.setState({ userId, userName: name, showModal: false });
    this.refreshTable();
  }

  getUserSeatNumber(): number {
    const { userId, table } = this.state;
    if (table) {
      return table.seats.findIndex(seat => seat && seat.userId === userId);
    }
    return -1;
  }

  getGroupVideoUsers(): SeatViewGroupVideoPropTypes {
    // Find my seat and get the ppl sitting around me.
    // 1. Get myself
    const { userId, table } = this.state;
    const user: User = {
      userId
    };

    let groupVideoUsers: SeatViewGroupVideoPropTypes = {
      user,
      frontLeftUser: null,
      frontUser: null,
      frontRightUser: null,
      leftUser: null,
      rightUser: null,
    }

    if (!table) {
      return groupVideoUsers;
    }
    // Get user seat seatNumber
    const seatNumber = this.getUserSeatNumber();
    groupVideoUsers.frontLeftUser = table.seats[getSeatNumber("frontLeft", seatNumber)];
    groupVideoUsers.frontUser = table.seats[getSeatNumber("front", seatNumber)];
    groupVideoUsers.frontRightUser = table.seats[getSeatNumber("frontRight", seatNumber)];
    groupVideoUsers.leftUser = table.seats[getSeatNumber("left", seatNumber)];
    groupVideoUsers.rightUser = table.seats[getSeatNumber("right", seatNumber)];
    return groupVideoUsers;
  };

  render() {
    const {
      showModal,
      hasJoined,
      userId,
      userName,
      table,
    } = this.state;
    const numActiveUsers = table ? table.seats.filter(seat => !!seat).length : 0;

    return (
      <div id="App" className="App">
        {showModal && (
          <NameModal onEnterName={this.handleEnterName} />
        )}
        {!!userName && (
          <HeaderAlert userName={userName} numActiveUsers={numActiveUsers} />
        )}
        {hasJoined && (
          <SeatViewGroupVideo {...this.getGroupVideoUsers()} />
        )}
        {table && (
          <SeatPicker
            userId={userId}
            table={table}
            onClick={this.handleClickJoin}
          />
        )}
      </div>
    );
  }
}

export default App;
