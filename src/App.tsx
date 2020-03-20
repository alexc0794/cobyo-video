import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { getRTC, AGORA_APP_ID } from './AgoraRTC';
import HeaderAlert from './HeaderAlert';
import NameModal from './NameModal';
import SeatPicker from './SeatPicker';
import GroupVideo, { User, GroupVideoUsers } from './GroupVideo';
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
      // console.log("OTHER USER PUBLISH", newUserId);
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
      // console.log("OTHER USER UNPUBLISH", unpublishedUser.uid.toString());
      this.setTableWithRemoteUsers(table);
    }
  }

  refreshTable = async () => {
    try {
      return await fetchTable(tableId);
    } catch {
      console.error("Can't find table");
      return null;
    }
  };

  setTableWithRemoteUsers = (table: Table) => {
    const remoteUserIds = rtc.client.remoteUsers.map(remoteUser => remoteUser.uid.toString());
    remoteUserIds.push(this.state.userId);
    // console.log(remoteUserIds);
    // console.log('before publish', table.seats);
    table.seats = table.seats.map(seat => {
      if (seat && remoteUserIds.includes(seat.userId)) {
        return seat;
      }
      return null;
    });
    // console.log('after publish', table.seats);
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
      console.error('Could not join table');
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

    // When I join a table, update the backend with the users actually on the stream.
    // console.log("JOIN TABLE");
    this.setTableWithRemoteUsers(table);

    this.setState({ hasJoined: true });
  }

  handleEnterName = async (name: string) => {
    // TODO: THIS IS A BIG HACK!!!! USER IDS WILL EVENTUALLY COLLIDE!!!
    // userId must be between 1-10000 :(
    const hash = hashCode(name).toString();
    let userId = hash.slice(hash.length - 4);
    const table = await this.refreshTable();
    this.setState({ userId, userName: name, showModal: false, table});

    // If we load the table and the user is already sitting at the table, auto-join
    if (table) {
      const index = table.seats.findIndex(seat => seat && seat.userId === userId);
      if (index >= 0) {
        console.log("Already sitting at table");
        this.handleClickJoin(index);
      }
    }
  }

  getUserSeatNumber(): number {
    const { userId, table } = this.state;
    if (table) {
      return table.seats.findIndex(seat => seat && seat.userId === userId);
    }
    return -1;
  }

  getGroupVideoUsers(): GroupVideoUsers {
    // Find my seat and get the ppl sitting around me.
    // 1. Get myself
    const { userId, table } = this.state;
    const user: User = {
      userId
    };

    let groupVideoUsers: GroupVideoUsers = {
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
    const numSeats = table.seats.length;
    groupVideoUsers.frontLeftUser = table.seats[getSeatNumber("frontLeft", seatNumber, numSeats)];
    groupVideoUsers.frontUser = table.seats[getSeatNumber("front", seatNumber, numSeats)];
    groupVideoUsers.frontRightUser = table.seats[getSeatNumber("frontRight", seatNumber, numSeats)];
    groupVideoUsers.leftUser = table.seats[getSeatNumber("left", seatNumber, numSeats)];
    groupVideoUsers.rightUser = table.seats[getSeatNumber("right", seatNumber, numSeats)];
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
          <GroupVideo
            {...this.getGroupVideoUsers()}
            tableId={tableId}
          />
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
