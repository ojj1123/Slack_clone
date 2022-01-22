import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import React, { ForwardedRef, forwardRef, MutableRefObject, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from './styles';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (index: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
}
const ChatList = forwardRef<Scrollbars, Props>(
  ({ chatSections, setSize, isReachingEnd }, scrollbarRef: ForwardedRef<Scrollbars>) => {
    const onScroll = useCallback(
      (values) => {
        if (values.scrollTop === 0 && !isReachingEnd) {
          setSize((prevSize) => prevSize + 1).then(() => {
            const current = (scrollbarRef as MutableRefObject<Scrollbars>)?.current;
            if (current) current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          });
        }
      },
      [setSize, isReachingEnd],
    );
    return (
      <ChatZone>
        <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
          {Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
        </Scrollbars>
      </ChatZone>
    );
  },
);

export default ChatList;
