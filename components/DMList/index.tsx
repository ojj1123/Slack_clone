import EachDM from '@components/EachDM';
import { IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import { CollapseButton } from './styles';

const DMList: VFC = () => {
  const { workspace } = useParams();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);
  const resetCount = useCallback((id) => {
    setCountList((list) => ({ ...list, [id]: 0 }));
  }, []);
  const onMessage = (data: IDM) => {
    console.log('dm옴', data);
    setCountList((list) => ({
      ...list,
      [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
    }));
  };
  useEffect(() => {
    console.log('DMList: workspace 바뀜', workspace);
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            const count = countList[member.id] || 0;
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
