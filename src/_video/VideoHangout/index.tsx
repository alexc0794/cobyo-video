import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { fetchAndUpdateTable, joinAndUpdateTable } from '_tables/actions';
import { selectJoinedTableSeat } from '_tables/selectors';
import { useInterval } from 'hooks';
import { RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS } from 'config';
import { VideoUserType } from './types';
import { RTC } from 'agora';
import VideoTable from '_video/VideoTable';
import VideoSettings from '_video/VideoSettings';
import VideoQuality from '_video/VideoQuality';
import { useWebSocket } from 'hooks';

type PropTypes = {
  tableId: string,
  userId: string,
  rtc: RTC,
};

export default function VideoHangout({
  tableId,
  userId,
  rtc,
}: PropTypes) {
  const { ws } = useWebSocket(tableId, userId);
  const [remoteUsers, setRemoteUsers] = useState<Array<VideoUserType>>([]);
  const dispatch = useDispatch();
  const seat = useSelector(selectJoinedTableSeat(userId || ""));

  useInterval(() => {
    dispatch(joinAndUpdateTable(tableId, seat, userId));
  }, RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS);

  useEffect(() => {
    rtc.client.on('user-published', handleUserPublished);
    rtc.client.on('user-unpublished', handleUserUnpublished);
    rtc.client.on('user-mute-updated', handleUserMuteUpdated);

    async function handleUserPublished(user: any) {
      const publishedUserId = user.uid.toString();
      await rtc.client.subscribe(user);
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
        audioMuted: user.audioMuted,
      }]));
    }

    async function handleUserUnpublished(user: any) {
      const unpublishedUserId = user.uid.toString();
      setRemoteUsers(currentRemoteUsers => currentRemoteUsers.filter(remoteUser => remoteUser.userId !== unpublishedUserId));
    }

    function handleUserMuteUpdated(user: IAgoraRTCRemoteUser) {
      setRemoteUsers(remoteUsers => remoteUsers.map(remoteUser => {
        if (remoteUser.userId === user.uid.toString()) {
          return {
            ...remoteUser,
            audioMuted: user.audioMuted,
            videoMuted: user.videoMuted,
          };
        }
        return remoteUser;
      }));
    }

    return () => rtc.client.removeAllListeners();
  }, [rtc.client, tableId, dispatch]);

  useEffect(() => {
    return () => ws && ws.close();
  }, [ws])

  return (
    <>
      <VideoTable tableId={tableId} userId={userId} rtc={rtc} remoteUsers={remoteUsers} ws={ws} />
      <VideoSettings tableId={tableId} userId={userId} rtc={rtc} ws={ws} />
      <VideoQuality tableId={tableId} userId={userId} rtc={rtc} />
    </>
  );
}
