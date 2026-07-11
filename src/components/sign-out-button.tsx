"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";

export function SignOutButton() {
  function clearDeviceData() {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("iatech-")) localStorage.removeItem(key);
    }
    navigator.serviceWorker?.controller?.postMessage({ type: "CLEAR_USER_CACHES" });
  }
  return <form action={signOutAction} onSubmit={clearDeviceData}><button className="nav-button" type="submit"><LogOut aria-hidden="true" size={16} /> Log out</button></form>;
}
