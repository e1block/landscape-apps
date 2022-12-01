import React from 'react';
import { Link } from 'react-router-dom';
import { useWritByFlagAndWritId } from '@/state/chat';
import { useChannelPreview } from '@/state/groups';
// eslint-disable-next-line import/no-cycle
import ChatContent from '@/chat/ChatContent/ChatContent';
import { udToDec } from '@urbit/api';
import bigInt from 'big-integer';
import HeapLoadingBlock from '@/heap/HeapLoadingBlock';
import ReferenceBar from './ReferenceBar';

export default function WritReference({
  chFlag,
  nest,
  idWrit,
  isScrolling,
}: {
  chFlag: string;
  nest: string;
  idWrit: string;
  isScrolling: boolean;
}) {
  const writObject = useWritByFlagAndWritId(chFlag, idWrit, isScrolling);
  const preview = useChannelPreview(nest);

  // TODO: handle failure for useWritByFlagAndWritId call.
  if (!writObject) {
    return <HeapLoadingBlock reference />;
  }

  const { writ } = writObject;
  const time = bigInt(udToDec(writ.seal.id.split('/')[1]));

  if (!('story' in writ.memo.content)) {
    return null;
  }

  return (
    <div className="writ-inline-block group">
      <Link
        to={
          preview?.group
            ? `/groups/${preview.group.flag}/channels/${nest}?msg=${time}`
            : ''
        }
        className="cursor-pointer p-2 group-hover:bg-gray-50"
      >
        <ChatContent story={writ.memo.content.story} isScrolling={false} />
      </Link>
      <ReferenceBar
        nest={nest}
        time={time}
        author={writ.memo.author}
        unSubbed
        groupFlag={preview?.group.flag}
        groupTitle={preview?.group.meta.title}
        channelTitle={preview?.meta?.title}
      />
    </div>
  );
}
