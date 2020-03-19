import React, { Component } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { getRTC, AGORA_APP_ID } from './AgoraRTC';
import Alert from 'react-bootstrap/Alert';
import NameModal from './NameModal';
import SeatPicker from './SeatPicker';
import GroupVideo, { User } from './GroupVideo';
import { fetchToken, fetchTable } from './services';
import { random } from './helpers';
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

class App extends Component<PropTypes, StateTypes> {
  constructor(props: any) {
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

  handleClickJoin = async (seatNumber: number) => {
    const { userId } = this.state;
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
      userId,
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
    // TODO: Dont hardcode table id
    const tableId = "1";
    try {
      const table: Table = await fetchTable(tableId);
      this.setState({
        userId: random(10000).toString(),
        userName: name,
        showModal: false,
        table,
      });
    } catch {
      console.error("Can't find table");
    }
  }

  render() {
    const {
      showModal,
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
          <SeatPicker table={table} onClick={this.handleClickJoin} />
        )}
      </div>
    );
  }
}

export default App;
