import React, { useState, useEffect } from 'react';
import Table from '../Table';
import { RTCType } from '../AgoraRTC';
import { TableType } from '../types';

type PropTypes = {
  userId: string|null,
  onJoin: (table: TableType, userId: string) => void,
  rtc: RTCType,
}

function Cafeteria({
  userId,
  onJoin,
  rtc,
}: PropTypes) {
  const [tableIds, setTableIds] = useState<Array<string>>([]);

  useEffect(() => {
    const HARDCODED_TABLE_IDS = ["1", "2"];
    setTableIds(HARDCODED_TABLE_IDS);
  }, []);

  return (
    <div>
      {tableIds.map(tableId => (
        <Table
          key={tableId}
          tableId={tableId}
          userId={userId}
          onJoin={onJoin}
          rtc={rtc}
        />
      ))}
    </div>
  );
}

export default Cafeteria;
