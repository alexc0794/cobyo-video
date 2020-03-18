import React, { useEffect, useState } from 'react';
import AgoraRTC, {
   IAgoraRTCClient,
   IMicrophoneAudioTrack,
   ICameraVideoTrack,
 } from "agora-rtc-sdk-ng"
import Button from 'react-bootstrap/Button';
import NameModal from './NameModal';
import { fetchToken } from './services';
import { random } from './helpers';

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

const AGORA_APP_ID = '0e12dacab1874ad5939be54efd01d4c3'
function App() {

  const [userId, setUserId] = useState(1);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    rtc.client.on("connection-state-change", (curState, revState, reason) => {
    });

    rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user
      await rtc.client.subscribe(user);

      // Get `RemoteAudioTrack` and `RemoteVideoTrack` in the `user` object.
      const remoteAudioTrack = user.audioTrack;
      const remoteVideoTrack = user.videoTrack;

      if (!remoteAudioTrack || !remoteVideoTrack) {
        return;
      }

      // Dynamically create a container in the form of a DIV element for playing the remote video track.
      const userContainer = document.createElement("div");
      // Specify the ID of the DIV container. You can use the `uid` of the remote user.
      userContainer.id = user.uid.toString();
      userContainer.style.width = "640px";
      userContainer.style.height = "480px";

      const appContainer = document.getElementById("App");
      if (appContainer) {
        appContainer.appendChild(userContainer);
      }

      // Play the remote audio and video tracks
      // Pass the ID of the DIV container and the SDK dynamically creates a user in the container for playing the remote video track
      remoteVideoTrack.play(user.uid.toString());
      // Play the audio track. Do not need to pass any DOM element
      remoteAudioTrack.play();
    });

    rtc.client.on("user-unpublished", user => {
      const playerContainer = document.getElementById(user.uid.toString());
      if (playerContainer) {
        playerContainer.remove();
      }
    });
  });

  const [hasJoined, setHasJoined] = useState(false);

  async function handleClickJoin() {
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

    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    setHasJoined(true);
  }

  const [showModal, setShowModal] = useState(true);

  function handleEnterName(name: string) {
    setUserId(random(10000))
    setUserName(name);
    setShowModal(false);
  }

  return (
    <div id="App" className="App">
      {showModal && (
        <NameModal onEnterName={handleEnterName} />
      )}
      <header className="App-header">
        <p>{userName}</p>
        {!hasJoined && (
            <Button onClick={handleClickJoin}>Join</Button>
        )}
      </header>
    </div>
  );
}

export default App;
