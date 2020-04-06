import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leaveAndUpdateTable } from '../redux/tablesActions';
import { selectStorefront } from '../redux/storefrontSelectors';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faSignOutAlt, faUserFriends, faPortrait } from '@fortawesome/free-solid-svg-icons';
import { RTCType } from '../AgoraRTC';
import { getSpeechRecognition } from '../SpeechRecognition';
import { sendAudioTranscript } from '../services';
import { useInterval } from '../hooks';
import { SEND_TRANSCRIPT_INTERVAL_MS } from '../config';
import cx from 'classnames';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTCType,
};

let speechRecognition: SpeechRecognition;
let finalTranscript = "";

function VideoSettings({
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
    if (!speechRecognition) { return; }
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
  }, SEND_TRANSCRIPT_INTERVAL_MS);

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

  const storefront = useSelector(selectStorefront);
  const [beautyEffectOn, setBeautyEffectOn] = useState<boolean>(storefront === 'CLUB');
  useEffect(() => {
    if (!beautyEffectOn || !rtc.localVideoTrack) { return; }
    rtc.localVideoTrack.setBeautyEffect(true, {
      rednessLevel: 1,
      smoothnessLevel: 1,
      lighteningLevel: 0
    });
  }, [rtc.localVideoTrack, beautyEffectOn]);

  async function handleClickBeautify() {
    if (!rtc.localVideoTrack) { return; }
    if (beautyEffectOn) {
      await rtc.localVideoTrack.setBeautyEffect(false);
    } else {
      await rtc.localVideoTrack.setBeautyEffect(true, {
        rednessLevel: 1,
        smoothnessLevel: 1,
      });
    }
    setBeautyEffectOn(!beautyEffectOn);
  }

  return (
    <div className={cx('video-settings', {
      'club-mode-lighter': storefront === 'CLUB',
    })}>
      <ButtonToolbar className={cx('video-settings-toolbar', {
        'club-mode': storefront === 'CLUB'
      })}>
        <ButtonGroup>
          <Button variant="secondary">
            <FontAwesomeIcon icon={faUserFriends} />
            <span>{numUsers === 1 ? `1 user` : `${numUsers} users`}</span>
          </Button>
          {beautyEffectOn ? (
            <Button variant="danger" onClick={handleClickBeautify}>
              <FontAwesomeIcon icon={faPortrait} />
              <span>Club</span>
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleClickBeautify}>
              <FontAwesomeIcon icon={faPortrait} />
              <span>Normal</span>
            </Button>
          )}
        </ButtonGroup>
        <ButtonGroup>
          {unmuted ? (
            <Button variant="secondary" onClick={handleMute}>
              <FontAwesomeIcon icon={faMicrophoneSlash} />
              <span>Mute</span>
            </Button>
          ) : (
            <Button variant="danger" onClick={handleUnmute}>
              <FontAwesomeIcon icon={faMicrophone} />
              <span>Unmute</span>
            </Button>
          )}
          <Button variant="secondary" onClick={handleLeave}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Leave</span>
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      {recentlyJoinedUser && <span style={{display: 'none'}}>{recentlyJoinedUser.uid.toString()} joined</span>}
      {recentlyLeftUser && <span style={{display: 'none'}}>{recentlyLeftUser.uid.toString()} left</span>}
    </div>
  )
}

export default memo(VideoSettings);
