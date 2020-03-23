import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { leaveAndUpdateTable } from '../../redux/tablesActions';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { RTCType } from '../../AgoraRTC';
import TableToast from '../TableToast';
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
      </ButtonToolbar>
      <TableToast tableId={tableId} />
    </div>
  )
}

export default GroupVideoSettings;
