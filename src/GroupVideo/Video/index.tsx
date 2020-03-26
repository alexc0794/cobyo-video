import React from 'react';
import cx from 'classnames';
import { UserInSeatType } from '../../types';
import './index.css';

type VideoPropTypes = {
  placement: string,
  user: UserInSeatType | null,
  size: "md" | "sm",
  speaking: boolean,
};

export default function Video({
  placement,
  user,
  size,
  speaking,
}: VideoPropTypes) {

  if (!user) {
    return <Placeholder placement={placement} size={size} />;
  }

  return (
    <div
      id={`video-${user.userId}`}
      className={cx("video", {
        "video-md": size === "md",
        "video-sm": size === "sm",
        "video-speaker": speaking
      })}
    />
  );
}

type PlaceholderPropTypes = {
  placement: string,
  size: "md" | "sm",
};

function Placeholder({ placement, size }: PlaceholderPropTypes) {
  return (
      <div className={cx("video video-placeholder", {
        "video-md": size === "md",
        "video-sm": size === "sm",
      })} />
  );
}
