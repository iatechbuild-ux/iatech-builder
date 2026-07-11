import Link from "next/link";
import { CloudOff } from "lucide-react";

export default function OfflinePage() {
  return <main className="page narrow-page"><section className="empty-state offline-page"><CloudOff aria-hidden="true" size={32} /><h1 className="page-title">You are offline</h1><p>Your submission and lab text stays on this device while you work. Reconnect to open private progress, upload evidence, or send work to your tutor.</p><Link className="btn primary" href="/student/dashboard">Try again</Link></section></main>;
}
