import React, { Component } from 'react';
import AgoraRTC, {
   IAgoraRTCClient,
   IMicrophoneAudioTrack,
   ICameraVideoTrack,
 } from "agora-rtc-sdk-ng"
import Alert from 'react-bootstrap/Alert';
import NameModal from './NameModal';
import SeatPicker from './SeatPicker';
import GroupChat, { User } from './GroupChat';
import { fetchToken } from './services';
import { random } from './helpers';

const AGORA_APP_ID = '0e12dacab1874ad5939be54efd01d4c3'

type RTC = {
  client: IAgoraRTCClient,
  joined: boolean,
  published: boolean,
  localStream: null,
  remoteStreams: Array<null>,
  localAudioTrack: IMicrophoneAudioTrack | null,
  localVideoTrack: ICameraVideoTrack | null,
  params: object
};

const rtc: RTC = {
  client: AgoraRTC.createClient({
    mode: "rtc",
    codec: "h264",
  }),
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  localAudioTrack: null,
  localVideoTrack: null,
  params: {}
};

type PropTypes = {};

type StateTypes = {
  userId: number,
  userName: string,
  users: Array<User>,
  hasJoined: boolean,
  showModal: boolean,
}

class App extends Component<PropTypes, StateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      userId: 0,
      userName: "",
      users: [],
      hasJoined: false,
      showModal: true,
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
    console.log('JOINING ' + seatNumber);
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

    console.log(rtc.client.remoteUsers);

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

  handleEnterName = (name: string) => {
    this.setState({
      userId: random(10000),
      userName: name,
      showModal: false
    });
  }

  render() {
    const {
      showModal,
      userName,
      hasJoined,
      users,
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
          <GroupChat users={users} />
        )}
        <SeatPicker numSeats={12} onClick={this.handleClickJoin} />
      </div>
    );
  }
}

export default App;
