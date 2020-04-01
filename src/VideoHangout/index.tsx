import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndUpdateTable, joinAndUpdateTable } from '../redux/tablesActions';
import { selectJoinedTableSeat } from '../redux/tablesSelectors';
import { useInterval } from '../hooks';
import { RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS } from '../config';
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
  }, RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS);

  useEffect(() => {
    rtc.client.on('user-published', handleUserPublished);
    rtc.client.on('user-unpublished', handleUserUnpublished);
    rtc.client.on('volume-indicator', handleVolumeIndicator);

    async function handleUserPublished(user: any) {
      const publishedUserId = user.uid.toString();
      await rtc.client.subscribe(user);
      console.log(JSON.stringify(user));
      console.log(JSON.stringify(rtc.client.remoteUsers));
      const videoTrack = user.videoTrack || user._videoTrack || null;
      const audioTrack = user.audioTrack || user._audioTrack || null;
      if (!videoTrack) {
        alert(`User ${publishedUserId} did not allow video. ${JSON.stringify(user)}`);
      }
      if (!audioTrack) {
        alert(`User ${publishedUserId} did not allow audio. ${JSON.stringify(user)}`);
      }

      dispatch(fetchAndUpdateTable(tableId));
      setRemoteUsers(currentRemoteUsers => ([...currentRemoteUsers, {
        userId: publishedUserId,
        videoTrack,
        audioTrack,
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
