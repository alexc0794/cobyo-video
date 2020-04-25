import React, {memo} from 'react';
import './index.css';

type PropType = {
  userId: string | null,
  onClickBuy: (userId:string|null)=>void,
}

function UserActionPopover({
  userId,
  onClickBuy
}:PropType) {
  return (
    <div className="UserActionPopover">
      <button className="UserActionPopover-button" onClick={() => onClickBuy(userId)}>Send a gift</button>
    </div>
  )
}

export default memo(UserActionPopover);
