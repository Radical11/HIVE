import { redirect } from "next/navigation";

export default function RootPage() {
  // MVP: always redirect to login (no auth state yet)
  redirect("/login");
}
