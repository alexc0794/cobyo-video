import React, { useEffect, useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { leaveAndUpdateTable } from 'redux/tablesActions';
import { RTC } from 'AgoraRTC';
import { NetworkQuality } from 'agora-rtc-sdk-ng';
import { joinCall, leaveCall, playRemoteUsers } from 'AgoraRTC';
import Toast from 'react-bootstrap/Toast';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { getDebugMode } from 'helpers';
import './index.css';

type PropTypes = {
  userId: string,
  tableId: string,
  rtc: RTC,
};

function VideoQuality({
  userId,
  tableId,
  rtc,
}: PropTypes) {
  const [lowUrgencyError, setLowUrgencyError] = useState<string|null>(null);
  const [highUrgencyError, setHighUrgencyError] = useState<string|null>(null);
  const [rejoinDisabled, setRejoinDisabled] = useState<boolean>(false);

  useEffect(() => {
    function handleException(event: any) {
      const { code, msg, uid } = event;
      setLowUrgencyError(`[${uid}]: ${msg} - ${code}.`);
    }
    function handleNetworkQuality(stats: NetworkQuality) {
      // See https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/networkquality.html
      const LOW_URGENCY_NETWORK_QUALITY_THRESHOLD = 3; // Users may feel that the communication is slightly impaired.
      const HIGH_URGENCY_NETWORK_QUALITY_THRESHOLD = 5; // The quality is so poor that users can barely communicate.
      const { downlinkNetworkQuality, uplinkNetworkQuality } = stats;
      if (
        downlinkNetworkQuality >= HIGH_URGENCY_NETWORK_QUALITY_THRESHOLD ||
        uplinkNetworkQuality >= HIGH_URGENCY_NETWORK_QUALITY_THRESHOLD
      ) {
        setLowUrgencyError('Experiencing network quality issues?');
        // setHighUrgencyError('Looks like you may be experiencing network quality issues. Want to rejoin?');
      } else if (
        downlinkNetworkQuality >= LOW_URGENCY_NETWORK_QUALITY_THRESHOLD ||
        uplinkNetworkQuality >= LOW_URGENCY_NETWORK_QUALITY_THRESHOLD
      ) {
        setLowUrgencyError('Experiencing network quality issues?');
      }
    }
    const { explicitOn } = getDebugMode();
    explicitOn && rtc.client.on('exception', handleException);
    rtc.client.on('network-quality', handleNetworkQuality);
    return () => {
      explicitOn && rtc.client.off('exception', handleException);
      rtc.client.off('network-quality', handleNetworkQuality);
    };
  }, [rtc.client]);

  function handleCloseToast() {
    setLowUrgencyError(null);
  }

  function handleCloseModal() {
    setHighUrgencyError(null);
  }

  async function handleRejoin() {
    setRejoinDisabled(true);
    await leaveCall(rtc);
    await joinCall(rtc, userId, tableId);
    setRejoinDisabled(false);
    setHighUrgencyError(null);
    setLowUrgencyError(null);
    playRemoteUsers(rtc);
  }

  const dispatch = useDispatch();
  async function handleLeave() {
    dispatch(leaveAndUpdateTable(tableId, userId));
  }

  return (
    <>
      <div className="VideoQuality-toast">
        <Toast show={!!lowUrgencyError} delay={500} onClose={handleCloseToast}>
          <Toast.Header>
            {lowUrgencyError}
            <button className="VideoQuality-toast-rejoin" onClick={handleRejoin} disabled={rejoinDisabled}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </Toast.Header>
        </Toast>
      </div>
      <Modal show={!!highUrgencyError} backdrop="static" keyboard={false} onHide={handleCloseModal}>
        <Modal.Header>
          {highUrgencyError}
        </Modal.Header>
        <Modal.Body>
          <Button className="mr-2" onClick={handleRejoin} disabled={rejoinDisabled}>Rejoin</Button>
          <Button onClick={handleLeave}>Leave</Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default memo(VideoQuality);
