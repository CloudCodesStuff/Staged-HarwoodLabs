import type { Step } from 'onborda';

export const steps: { tour: string; steps: Step[] }[] = [
  {
    tour: 'main',
    steps: [
      {
        icon: '👥',
        title: 'Invite your clients or team',
        content: 'Go to the Members tab and send invites. Clients get a branded portal and email.',
        selector: '#onborda-invite-members',
        side: "bottom",
        showControls: true,
      },
      {
        icon: '📄',
        title: 'Add files & documents',
        content: 'Use the Files tab to upload and share assets, contracts, or deliverables.',
        selector: '#onborda-add-files',
        side: "bottom",
        showControls: true,
      },
      {
        icon: '📣',
        title: 'Share updates & milestones',
        content: 'Post updates and track milestones to keep everyone in the loop.',
        selector: '#onborda-share-updates',
        side: "bottom",
        showControls: true,
      },
      {
        icon: '🎨',
        title: 'Customize your portal',
        content: 'Make it yours with the Portal Style tab.',
        selector: '#onborda-customize-portal',
        side: "bottom",
        showControls: true,
      },
    ]
  }
]; 