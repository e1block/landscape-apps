import { useChannelFlag } from '@/hooks';
import useIsChannelUnread from '@/notifications/useIsChannelUnread';
import { useNotifications } from '@/notifications/useNotifications';
import { useChatState } from '@/state/chat';
import { useRouteGroup } from '@/state/groups';
import useHarkState from '@/state/hark';
import { useEffect } from 'react';

export default function useDismissChannelNotifications() {
  const flag = useRouteGroup();
  const chFlag = useChannelFlag();
  const { isChannelUnread } = useIsChannelUnread();
  const { notifications } = useNotifications(flag);

  /**
   * TODO: Confirm expected behavior for navigating to a Channel with Unreads.
   *
   * Does clicking on an Unread Channel automatically scrollback to the
   * last read message? Should it only be dismissed when reaching the end of
   * new messages?
   */
  // dismiss unread notifications while viewing channel
  useEffect(() => {
    if (chFlag && isChannelUnread(chFlag)) {
      // dismiss brief
      useChatState.getState().markRead(chFlag);
      // iterate bins, saw each rope
      notifications.forEach((n) => {
        n.bins.forEach((b) => {
          if (
            b.unread &&
            b.topYarn?.rope.channel &&
            b.topYarn.rope.channel.includes(chFlag)
          ) {
            useHarkState.getState().sawRope(b.topYarn.rope);
          }
        });
      });
    }
  }, [chFlag, isChannelUnread, notifications]);
}