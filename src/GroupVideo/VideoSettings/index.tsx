import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { leaveAndUpdateTable } from '../../redux/tablesActions';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faSignOutAlt, faUserFriends, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { RTCType } from '../../AgoraRTC';
// import TopicsPopover from '../TopicsPopover';
import { getSpeechRecognition } from '../../SpeechRecognition';
import { sendAudioTranscript } from '../../services';
import { useInterval } from '../../hooks';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTCType,
};

let speechRecognition: SpeechRecognition;
let finalTranscript = "";

function GroupVideoSettings({
  tableId,
  userId,
  rtc,
}: PropTypes) {
  const [numUsers, setNumUsers] = useState<number>(rtc.client.remoteUsers.length + 1);
  const [recentlyJoinedUser, setRecentlyJoinedUser] = useState<any>(null);
  const [recentlyLeftUser, setRecentlyLeftUser] = useState<any>(null);

  useEffect(() => {
    rtc.client.on('user-published', (user: any) => {
      setRecentlyJoinedUser(user);
      setNumUsers(rtc.client.remoteUsers.length + 1);
    });
    rtc.client.on('user-unpublished', (user: any) => {
      setRecentlyLeftUser(user);
      setNumUsers(rtc.client.remoteUsers.length + 1);
    });
    return () => {
      rtc.client.removeAllListeners('user-published');
      rtc.client.removeAllListeners('user-unpublished');
    };
  }, [rtc.client]);


  const [, setInterimTranscript] = useState("");
  useEffect(() => {
    let shouldRecognize = true;
    speechRecognition = getSpeechRecognition();
    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      Array.from(event.results).forEach(result => {
        const transcript= result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          setInterimTranscript(transcript);
        }
      });
    };
    speechRecognition.onend = () => {
      if (shouldRecognize) {
        speechRecognition.start();
      }
    }
    speechRecognition.start();

    return () => {
      shouldRecognize = false;
      speechRecognition.stop();
    };
  }, [tableId]);

  useInterval(async () => {
    if (!!finalTranscript && await sendAudioTranscript(finalTranscript, tableId)) {
        finalTranscript = '';
    }
  }, 15000);

  const [unmuted, setUnmuted] = useState<boolean>(true);
  function handleMute() {
    if (!rtc.localAudioTrack) { return; }
    rtc.localAudioTrack.setMute(true);
    setUnmuted(false);
  }
  function handleUnmute() {
    if (!rtc.localAudioTrack) { return; }
    rtc.localAudioTrack.setMute(false);
    setUnmuted(true);
  }

  const dispatch = useDispatch();
  function handleLeave() {
    if (!userId) { return; }
    dispatch(leaveAndUpdateTable(tableId, userId));
  }

  return (
    <div className="video-settings">
      <ButtonToolbar className="video-settings-toolbar">
        <ButtonGroup>
          <Button variant="primary" disabled>
            <FontAwesomeIcon icon={faUserFriends} />
            <span>{numUsers === 1 ? `1 user` : `${numUsers} users`}</span>
          </Button>
          <Button variant="danger" onClick={handleLeave}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Leave</span>
          </Button>
          {unmuted ? (
            <Button variant="secondary" onClick={handleMute}>
              <FontAwesomeIcon icon={faMicrophoneSlash} />
              <span>Mute</span>
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleUnmute}>
              <FontAwesomeIcon icon={faMicrophone} />
              <span>Unmute</span>
            </Button>
          )}
        </ButtonGroup>
        {false && (
          <ButtonGroup>
            <OverlayTrigger
              trigger="click"
              placement="top"
              overlay={
                <Popover
                  id="placement"
                >
                  <Popover.Title><strong>Discussed Topics</strong></Popover.Title>
                  <Popover.Content>WIP</Popover.Content>
                </Popover>
              }
            >
              <Button variant="info" onClick={() => {}}>
                <FontAwesomeIcon icon={faQuoteRight} />
                <span>Topics</span>
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        )}
      </ButtonToolbar>
      {recentlyJoinedUser && <span>{recentlyJoinedUser.uid.toString()} joined</span>}
      {recentlyLeftUser && <span>{recentlyLeftUser.uid.toString()} left</span>}
    </div>
  )
}

export default GroupVideoSettings;
