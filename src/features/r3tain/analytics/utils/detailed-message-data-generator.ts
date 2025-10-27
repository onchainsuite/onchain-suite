import { format, subDays } from "date-fns";

export interface DetailedMessageData {
  id: string;
  channel: "email" | "sms";
  title: string;
  subtitle: string;
  type: "Regular" | "A/B Test" | "Automated";
  sentDate: Date;
  sent: number;
  deliveries: number | null;
  openRate: number;
  clickRate: number;
  opens: number;
  clicks: number;
}

const emailTitles = [
  { title: "Office Styles", subtitle: "Do You Need a Hug?" },
  { title: "Seasonal Sale Email", subtitle: "Have You Heard The News?" },
  { title: "Save 30% College Promo", subtitle: "Do You Need a Hug?" },
  { title: "Latest Styles", subtitle: "A Summary of Last Weeks AGM" },
  { title: "Mother's Day Sale", subtitle: "Don't Leave Town Without This!" },
  { title: "Abandoned Cart", subtitle: "We Just Wanted To Say Thank You" },
  { title: "Newsletter Welcome Email", subtitle: "Have You Heard The News?" },
  { title: "Black Friday Special", subtitle: "Limited Time Offers Inside" },
  { title: "Holiday Greetings", subtitle: "Season's Best Wishes" },
  { title: "Product Launch", subtitle: "Introducing Our Latest Collection" },
  { title: "Customer Survey", subtitle: "Help Us Improve Your Experience" },
  { title: "Weekly Newsletter", subtitle: "This Week's Top Stories" },
  { title: "Flash Sale Alert", subtitle: "24 Hours Only - Don't Miss Out" },
  {
    title: "Birthday Special",
    subtitle: "Your Special Day Deserves Special Savings",
  },
  { title: "Re-engagement Campaign", subtitle: "We Miss You - Come Back!" },
];

const smsMessages = [
  {
    title: "Fresh for Spring",
    subtitle: "BOGO Deal Coming to a Store Near You",
  },
  { title: "Vacation Looks", subtitle: "We Just Wanted To Say Thank You" },
  { title: "Flash Sale SMS", subtitle: "50% Off Everything - Today Only" },
  { title: "Order Update", subtitle: "Your Package Is On The Way" },
  { title: "Appointment Reminder", subtitle: "Don't Forget - Tomorrow at 2PM" },
  { title: "Limited Offer", subtitle: "Exclusive SMS Subscriber Deal" },
  { title: "New Arrival Alert", subtitle: "Just Dropped - Check It Out" },
  { title: "Cart Abandonment", subtitle: "Complete Your Purchase - 10% Off" },
  { title: "Event Invitation", subtitle: "You're Invited to Our VIP Sale" },
  { title: "Loyalty Reward", subtitle: "Your Points Are Ready to Use" },
];

function generateDetailedMessage(index: number): DetailedMessageData {
  const isEmail = Math.random() > 0.3; // 70% email, 30% SMS
  const messagePool = isEmail ? emailTitles : smsMessages;
  const message = messagePool[Math.floor(Math.random() * messagePool.length)];

  // Generate realistic dates over the past year
  const daysAgo = Math.floor(Math.random() * 365);
  const sentDate = subDays(new Date(), daysAgo);

  // Generate realistic metrics
  const sent = Math.floor(Math.random() * 10000) + 1000;

  let openRate: number;
  let clickRate: number;

  if (isEmail) {
    // Email metrics: 10-95% open rate, 1-25% click rate
    openRate = Math.floor(Math.random() * 85) + 10;
    clickRate = Math.floor(Math.random() * 24) + 1;
  } else {
    // SMS metrics: 85-98% open rate, 5-30% click rate
    openRate = Math.floor(Math.random() * 13) + 85;
    clickRate = Math.floor(Math.random() * 25) + 5;
  }

  const opens = Math.round(sent * (openRate / 100));
  const clicks = Math.round(sent * (clickRate / 100));

  return {
    id: `msg-${index}-${Date.now()}`,
    channel: isEmail ? "email" : "sms",
    title: message.title,
    subtitle: message.subtitle,
    type: "Regular",
    sentDate,
    sent,
    deliveries: null, // Showing as "--" in the original
    openRate,
    clickRate,
    opens,
    clicks,
  };
}

export function generateDetailedMessageData(count = 33): DetailedMessageData[] {
  const data: DetailedMessageData[] = [];

  for (let i = 0; i < count; i++) {
    data.push(generateDetailedMessage(i));
  }

  // Sort by sent date descending (newest first)
  return data.sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime());
}

// Export functions for CSV and PDF
export function exportToCSV(
  data: DetailedMessageData[],
  filename = "message-performance.csv"
) {
  const headers = [
    "Channel",
    "Message Title",
    "Message Subtitle",
    "Type",
    "Sent Date",
    "Sent",
    "Deliveries",
    "Open Rate",
    "Click Rate",
  ];

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.channel,
        `"${row.title}"`,
        `"${row.subtitle}"`,
        row.type,
        format(row.sentDate, "dd/MM/yyyy"),
        row.sent,
        row.deliveries ?? "--",
        `${row.openRate}%`,
        `${row.clickRate}%`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
