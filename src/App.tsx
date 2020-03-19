import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { getRTC, AGORA_APP_ID } from './AgoraRTC';
import Alert from 'react-bootstrap/Alert';
import NameModal from './NameModal';
import SeatPicker from './SeatPicker';
import GroupVideo, { User } from './GroupVideo';
import { fetchToken, fetchTable, joinTable } from './services';
import { hashCode } from './helpers';
import { Table } from './types';

type PropTypes = {};

type StateTypes = {
  userId: string,
  userName: string,
  users: Array<User>,
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
      users: [],
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

    // Get `RemoteAudioTrack` and `RemoteVideoTrack` in the `user` object.
    const remoteAudioTrack = user.audioTrack;
    const remoteVideoTrack = user.videoTrack;

    if (!remoteAudioTrack || !remoteVideoTrack) {
      return;
    }

    const newUser: User = { userId: user.uid.toString() };
    const { users } = this.state;
    this.setState({ users: [...users, newUser] });

    // This a hack
    setTimeout(() => {
      // Play the remote audio and video tracks
      // Pass the ID of the DIV container and the SDK dynamically creates a user in the container for playing the remote video track
      remoteVideoTrack.play(`video-${user.uid.toString()}`);
      // Play the audio track. Do not need to pass any DOM element
      remoteAudioTrack.play();
    }, 3000);
  }

  onUserUnpublish = (unpublishedUser: any) => {
    const { users } = this.state;
    this.setState((prevState) => ({
      users: users.filter(
        (user: User) => user.userId !== unpublishedUser.uid.toString()
      )
    }));
  }

  syncTable = async () => {
    try {
      const table: Table = await fetchTable(tableId);
      this.setState({ table });
    } catch {
      console.error("Can't find table");
    }
  };

  handleClickJoin = async (seatNumber: number) => {
    const { userId } = this.state;

    const joined = await joinTable(tableId, seatNumber, userId);
    if (!joined) {
      // TODO: Handle error
      return;
    }

    this.syncTable();

    let token = ""
    try {
      token = await fetchToken(userId);
    } catch {
      alert("No token found. Alex probably fucked up.");
    }

    await rtc.client.join(
      AGORA_APP_ID,
      "channelName",
      token,
      parseInt(userId, 10), // Must be an int, otherwise token invalidates :(
    );

    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    const newUser: User = { userId: userId.toString() };
    const { users } = this.state;
    this.setState({
      users: [...users, newUser],
    });

    // TODO: Move this to GroupChat component
    rtc.localVideoTrack.play(`video-${userId.toString()}`);

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
    this.syncTable();
  }

  render() {
    const {
      showModal,
      userId,
      userName,
      hasJoined,
      users,
      table,
    } = this.state;

    return (
      <div id="App" className="App">
        {showModal && (
          <NameModal onEnterName={this.handleEnterName} />
        )}
        <header className="App-header">
          {!!userName && (
            <Alert variant="primary">Logged in as "{userName}"</Alert>
          )}
          {hasJoined && (rtc.client.remoteUsers.length === 0 ? (
            <p>You are the only user in this channel</p>
          ) : (
            <p>There are {rtc.client.remoteUsers.length + 1} users in this channel</p>
          ))}
        </header>
        {!!users.length && (
          <GroupVideo users={users} />
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
