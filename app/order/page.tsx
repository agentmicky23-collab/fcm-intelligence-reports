import { redirect } from "next/navigation";

// /order redirects to /reports where the order modal is available
export default function OrderPage() {
  redirect("/reports");
}
