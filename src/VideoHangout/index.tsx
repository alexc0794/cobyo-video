import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateTable, joinAndUpdateTable } from '../redux/tablesActions';
import { selectJoinedTableSeat } from '../redux/tablesSelectors';
import { useInterval } from '../hooks';
import { VideoUserType, VolumeType } from './types';
import { RTCType } from '../AgoraRTC';
import VideoTable from '../VideoTable';
import VideoSettings from '../VideoSettings';

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTCType,
};

export default function VideoHangout({
  tableId,
  userId,
  rtc,
}: PropTypes) {

  const [remoteUsers, setRemoteUsers] = useState<Array<VideoUserType>>([]);
  const [, setVolumes] = useState<Array<VolumeType>>([]);
  const dispatch = useDispatch();
  const seat = useSelector(selectJoinedTableSeat(userId || ""));

  useInterval(() => {
    dispatch(joinAndUpdateTable(tableId, seat, userId));
  }, 10000);

  useEffect(() => {
    rtc.client.on('user-published', handleUserPublished);
    rtc.client.on('user-unpublished', handleUserUnpublished);
    rtc.client.on('volume-indicator', handleVolumeIndicator);

    async function handleUserPublished(user: any) {
      const publishedUserId = user.uid.toString();
      await rtc.client.subscribe(user);
      if (!user.videoTrack) {
        alert(`User ${publishedUserId} did not allow video.`);
        return;
      }
      if (!user.audioTrack) {
        alert(`User ${publishedUserId} did not allow audio.`);
        return;
      }

      dispatch(fetchAndUpdateTable(tableId));
      setRemoteUsers(currentRemoteUsers => ([...currentRemoteUsers, {
        userId: publishedUserId,
        videoTrack: user.videoTrack,
        audioTrack: user.audioTrack,
      }]));
    }

    async function handleUserUnpublished(user: any) {
      const unpublishedUserId = user.uid.toString();
      setRemoteUsers(currentRemoteUsers => currentRemoteUsers.filter(remoteUser => remoteUser.userId !== unpublishedUserId));
    }

    async function handleVolumeIndicator(volumes: Array<object>) {
      setVolumes(volumes.map((volume: any) => ({
        level: volume.level,
        userId: volume.uid.toString()
      })));
    }

    return () => {
      rtc.client.removeAllListeners();
    };
  }, [rtc.client, tableId, dispatch]);

  return (
    <>
      <VideoTable tableId={tableId} userId={userId} rtc={rtc} remoteUsers={remoteUsers} />
      <VideoSettings tableId={tableId} userId={userId} rtc={rtc} />
    </>
  );
}