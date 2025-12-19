import { Inbox, Mail, Star, Archive } from "lucide-react";
import { Email } from "../types";

export const emails: Email[] = [
  {
    id: 1,
    from: "Alex Thompson",
    email: "alex@example.com",
    profileId: "1",
    avatar: "A",
    subject: "Re: Exclusive NFT Drop - Early Access",
    preview:
      "Thanks for the heads up! I'm definitely interested in the early access. Quick question - will there be...",
    time: "10:32 AM",
    date: "Today",
    unread: true,
    starred: true,
    hasAttachment: true,
    campaign: "NFT Drop Campaign",
    thread: [
      {
        id: 1,
        from: "You",
        to: "alex@example.com",
        time: "Yesterday, 3:45 PM",
        content:
          "Hi Alex,\n\nWe're excited to offer you early access to our upcoming NFT drop! As one of our most engaged community members, you'll get first pick before the public sale.\n\nThe drop goes live on December 5th at 2 PM UTC.\n\nBest,\nThe Team",
      },
      {
        id: 2,
        from: "Alex Thompson",
        to: "you@yourcompany.com",
        time: "Today, 10:32 AM",
        content:
          "Thanks for the heads up! I'm definitely interested in the early access.\n\nQuick question - will there be a limit on how many I can mint? Also, what's the price point looking like?\n\nCheers,\nAlex",
      },
    ],
  },
  {
    id: 2,
    from: "Sarah Chen",
    email: "sarah@example.com",
    profileId: "2",
    avatar: "S",
    subject: "Question about staking rewards",
    preview:
      "Hey! I noticed my staking rewards haven't updated in a few days. Is this expected behavior or...",
    time: "9:15 AM",
    date: "Today",
    unread: true,
    starred: false,
    hasAttachment: false,
    campaign: "Staking Update",
    thread: [
      {
        id: 1,
        from: "Sarah Chen",
        to: "you@yourcompany.com",
        time: "Today, 9:15 AM",
        content:
          "Hey!\n\nI noticed my staking rewards haven't updated in a few days. Is this expected behavior or should I be seeing daily updates?\n\nMy wallet: 0xabcd...efgh\n\nThanks,\nSarah",
      },
    ],
  },
  {
    id: 3,
    from: "Mike Roberts",
    email: "mike@example.com",
    profileId: "3",
    avatar: "M",
    subject: "Re: Your feedback matters",
    preview:
      "Great survey! One suggestion - it would be awesome if you could add more DeFi integrations...",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    starred: false,
    hasAttachment: true,
    campaign: "Feedback Survey",
    thread: [
      {
        id: 1,
        from: "You",
        to: "mike@example.com",
        time: "2 days ago, 11:00 AM",
        content:
          "Hi Mike,\n\nWe'd love to hear your thoughts! Please take our quick 2-minute survey to help us improve.\n\n[Take Survey]\n\nThanks,\nThe Team",
      },
      {
        id: 2,
        from: "Mike Roberts",
        to: "you@yourcompany.com",
        time: "Yesterday, 4:22 PM",
        content:
          "Great survey! One suggestion - it would be awesome if you could add more DeFi integrations. Specifically, I'd love to see Aave and Compound support.\n\nKeep up the good work!\n\nMike",
      },
    ],
  },
  {
    id: 4,
    from: "Emily Watson",
    email: "emily@example.com",
    profileId: "4",
    avatar: "E",
    subject: "Withdrawal issue - need help",
    preview:
      "Hi there, I've been trying to withdraw my tokens but the transaction keeps failing. I've tried...",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    starred: true,
    hasAttachment: false,
    campaign: "Direct Message",
    thread: [
      {
        id: 1,
        from: "Emily Watson",
        to: "you@yourcompany.com",
        time: "Yesterday, 2:10 PM",
        content:
          "Hi there,\n\nI've been trying to withdraw my tokens but the transaction keeps failing. I've tried multiple times with different gas settings.\n\nTx hash: 0x123...abc\n\nCan you help?\n\nEmily",
      },
    ],
  },
  {
    id: 5,
    from: "James Wilson",
    email: "james@example.com",
    profileId: "5",
    avatar: "J",
    subject: "Thanks for the airdrop!",
    preview:
      "Just wanted to say thanks for the surprise airdrop! Really appreciate being part of this community...",
    time: "Dec 1",
    date: "Dec 1",
    unread: false,
    starred: false,
    hasAttachment: false,
    campaign: "Airdrop Announcement",
    thread: [
      {
        id: 1,
        from: "James Wilson",
        to: "you@yourcompany.com",
        time: "Dec 1, 6:45 PM",
        content:
          "Just wanted to say thanks for the surprise airdrop! Really appreciate being part of this community.\n\nLooking forward to what's next!\n\nJames",
      },
    ],
  },
];

export const folders = [
  { name: "All", count: 12, icon: Inbox },
  { name: "Unread", count: 2, icon: Mail },
  { name: "Starred", count: 2, icon: Star },
  { name: "Archived", count: 5, icon: Archive },
];
