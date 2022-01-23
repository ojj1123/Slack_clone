import { IChat, IDM } from '@typings/db';
import React, { memo, useMemo, VFC } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3095';
interface Props {
  data: IDM | IChat;
}
const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams();
  const user = 'Sender' in data ? data.Sender : data.User; // type guard

  const result = useMemo(
    () =>
      data.content.startsWith('uploads/') ? (
        <img src={`${BASE_URL}/${data.content}`} alt={'data'} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          input: data.content,
          pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />;
          },
        })
      ),
    [data.content, workspace],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
