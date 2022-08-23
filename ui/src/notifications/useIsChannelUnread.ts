import useAllBriefs from '@/logic/useAllBriefs';
import { useNotifications } from './useNotifications';

export default function useIsChannelUnread() {
  const { notifications } = useNotifications();
  const briefs = useAllBriefs();

  /**
   * A Channel is unread if:
   * - it's brief has new unseen items, or
   * - any of its bins is unread and matches the chFlag
   */
  function isChannelUnread(chFlag: string) {
    const hasActivity = (briefs[chFlag]?.count ?? 0) > 0;

    return (
      hasActivity ||
      notifications.some((n) =>
        n.bins.some(
          (b) => b.unread && b.topYarn?.rope.channel?.includes(chFlag)
        )
      )
    );
  }

  return {
    isChannelUnread,
  };
}