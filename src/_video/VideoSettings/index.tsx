import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leaveAndUpdateTable } from '_tables/actions';
import { selectTableById } from '_tables/selectors';
import { selectStorefront } from '_storefront/selectors';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { RTC } from 'agora';
import { getSpeechRecognition } from '_speechRecognition';
import { sendAudioTranscript } from 'services';
import { TableType } from 'types';
import { useInterval } from 'hooks';
import { SEND_TRANSCRIPT_INTERVAL_MS } from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faSignOutAlt, faUserFriends, faPortrait } from '@fortawesome/free-solid-svg-icons';
import Player from 'music/Player';
import cx from 'classnames';
import './index.css';

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTC,
  ws: WebSocket|undefined,
};

let speechRecognition: SpeechRecognition;
let finalTranscript = "";

function VideoSettings({
  tableId,
  userId,
  rtc,
  ws,
}: PropTypes) {
  const [numUsers, setNumUsers] = useState<number>(rtc.client.remoteUsers.length + 1);
  const [recentlyJoinedUser, setRecentlyJoinedUser] = useState<any>(null);
  const [recentlyLeftUser, setRecentlyLeftUser] = useState<any>(null);

  useEffect(() => {
    function handleUserPublished(user: any) {
      setRecentlyJoinedUser(user);
      setNumUsers(rtc.client.remoteUsers.length + 1);
    }
    function handleUserUnpublished(user: any) {
      setRecentlyLeftUser(user);
      setNumUsers(rtc.client.remoteUsers.length + 1);
    }
    rtc.client.on('user-published', handleUserPublished);
    rtc.client.on('user-unpublished', handleUserUnpublished);
    return () => {
      rtc.client.off('user-published', handleUserPublished);
      rtc.client.off('user-unpublished', handleUserUnpublished);
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
  const [beautyEffectOn, setBeautyEffectOn] = useState<boolean>(false);
  useEffect(() => {
    if (!rtc.localVideoTrack) { return; }
    rtc.localVideoTrack.on('beauty-effect-overload', () => {
      if (!rtc.localVideoTrack) { return; }
      rtc.localVideoTrack.setBeautyEffect(false);
      setBeautyEffectOn(false);
    });
  }, [rtc.localVideoTrack]);

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

  const table: TableType = useSelector(selectTableById(tableId));
  const showPlayer = table.shape === 'DANCE_FLOOR';
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
              <span>Beauty</span>
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleClickBeautify}>
              <FontAwesomeIcon icon={faPortrait} />
              <span>Normal</span>
            </Button>
          )}
        </ButtonGroup>
        {showPlayer && ws && (
          <Player
            tableId={tableId}
            tableName={'Virtual Club Dance Floor 🔥'} // TODO: Replace with actual table name
            userId={userId}
            ws={ws}
            isDJ={userId === '4196925809' || userId === '3339544354' || userId === '2997029709'}
          />
        )}
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
