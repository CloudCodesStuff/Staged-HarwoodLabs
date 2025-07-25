import { Layers } from 'lucide-react';
import { AvatarCircles } from '@/components/magicui/avatar-circles';

const avatars = [
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/16860528',
    profileUrl: 'https://github.com/dillionverma',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/20110627',
    profileUrl: 'https://github.com/tomonarifeehan',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/106103625',
    profileUrl: 'https://github.com/BankkRoll',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/59228569',
    profileUrl: 'https://github.com/safethecode',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/59442788',
    profileUrl: 'https://github.com/sanjay-mali',
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/89768406',
    profileUrl: 'https://github.com/itsarghyadas',
  },
];

export function AvatarCirclesDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <AvatarCircles avatarUrls={avatars} numPeople={0} />

      <p className="font-mono text-muted-foreground text-sm ">
        Join 99+ agencies growing with Staged
      </p>
    </div>
  );
}
