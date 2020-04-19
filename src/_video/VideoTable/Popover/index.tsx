import React, {memo} from 'react';
import './index.css';

type PropType = {
  userId: string | null,
  onClickBuy: (userId:string|null)=>void,
}

function RemoteVideoPopover({
  userId,
  onClickBuy
}:PropType) {
  return (
    <div className="PopoverContent">
      <button className="PopoverContent-button" onClick={() => onClickBuy(userId)}>Buy drink for this person</button>
      <button className="PopoverContent-button">Poke</button>
      <button className="PopoverContent-button">Send Message</button>
      <button className="PopoverContent-button">Mute</button>
    </div>
  )
}

export default memo(RemoteVideoPopover);