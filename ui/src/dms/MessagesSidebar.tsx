import React, { useState } from 'react';
import cn from 'classnames';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  isDMBrief,
  isGroupBrief,
  useBriefs,
  usePendingDms,
  usePinnedChats,
} from '../state/chat';
import NewMessageIcon from '../components/icons/NewMessageIcon';
import { useIsMobile } from '../logic/useMedia';
import SidebarLink from '../components/Sidebar/SidebarLink';
import MagnifyingGlass from '../components/icons/MagnifyingGlass';
import useSidebarSort, { RECENT } from '../logic/useSidebarSort';
import CaretDownIcon from '../components/icons/CaretDownIcon';
import ChatSmallIcon from '../components/icons/ChatSmallIcon';
import PersonSmallIcon from '../components/icons/PersonSmallIcon';
import CmdSmallIcon from '../components/icons/CmdSmallIcon';
import MessagesSidebarItem from './MessagesSidebarItem';

type SidebarFilter = 'Direct Messages' | 'All Messages' | 'Group Talk Channels';

const filters: Record<string, SidebarFilter> = {
  dms: 'Direct Messages',
  all: 'All Messages',
  groups: 'Group Talk Channels',
};

export default function MessagesSidebar() {
  const pending = usePendingDms();
  const isMobile = useIsMobile();
  const { sortOptions } = useSidebarSort(RECENT);
  const [filter, setFilter] = useState<SidebarFilter>(filters.dms);
  const briefs = useBriefs();
  const pinned = usePinnedChats();

  const organizedBriefs = Object.keys(briefs)
    .filter((b) => {
      if (pending.includes(b)) {
        return false;
      }

      if (pinned.includes(b)) {
        return false;
      }

      if (filter === filters.groups && isDMBrief(b)) {
        return false;
      }

      if (filter === filters.dms && isGroupBrief(b)) {
        return false;
      }

      return true; // is all
    })
    .sort(sortOptions[RECENT]);

  return (
    <nav
      className={cn(
        'flex h-full flex-col border-r-2 border-gray-50 bg-white',
        !isMobile && 'w-64',
        isMobile && 'fixed top-0 left-0 z-40 w-full'
      )}
    >
      <ul className={cn('flex w-full flex-col p-2', !isMobile && 'w-64')}>
        <SidebarLink
          icon={<MagnifyingGlass className="h-6 w-6" />}
          to="/dm/search"
        >
          Search Messages
        </SidebarLink>
        <SidebarLink
          to="/dm/new"
          color="text-blue"
          icon={<NewMessageIcon className="h-6 w-6" />}
        >
          New Message
        </SidebarLink>
        <li className="flex items-center space-x-2 px-2 py-3">
          <span className="text-xs font-semibold text-gray-400">Pinned</span>
          <div className="grow border-b-2 border-gray-100" />
        </li>
        {pinned.map((ship: string) => (
          <MessagesSidebarItem key={ship} whom={ship} brief={briefs[ship]} />
        ))}
        <li>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={'default-focus rounded-lg p-0.5 text-gray-600'}
              aria-label="Groups Filter Options"
            >
              <div className="default-focus flex items-center space-x-2 rounded-lg py-2 text-base font-semibold hover:bg-gray-50">
                <span className="pl-1">{filter}</span>
                <CaretDownIcon className="w-4 text-gray-400" />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="dropdown text-gray-600">
              <DropdownMenu.Item
                className={cn(
                  'dropdown-item flex items-center space-x-2 rounded-none',
                  filter === filters.all && 'bg-gray-50 text-gray-800'
                )}
                onClick={() => setFilter(filters.all)}
              >
                <ChatSmallIcon className="mr-2 h-4 w-4" />
                All Messages
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={cn(
                  'dropdown-item flex items-center space-x-2 rounded-none',
                  filter === filters.dms && 'bg-gray-50 text-gray-800'
                )}
                onClick={() => setFilter(filters.dms)}
              >
                <PersonSmallIcon className="mr-2 h-4 w-4" />
                Direct Messages
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={cn(
                  'dropdown-item flex items-center space-x-2 rounded-none',
                  filter === filters.groups && 'bg-gray-50 text-gray-800'
                )}
                onClick={() => setFilter(filters.groups)}
              >
                <CmdSmallIcon className="mr-2 h-4 w-4" />
                Group Talk Channels
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </li>
        {pending &&
          filter !== filters.groups &&
          pending.map((ship) => (
            <MessagesSidebarItem
              pending
              key={ship}
              whom={ship}
              brief={briefs[ship]}
            />
          ))}
        {organizedBriefs.map((ship) => (
          <MessagesSidebarItem key={ship} whom={ship} brief={briefs[ship]} />
        ))}
      </ul>
    </nav>
  );
}
