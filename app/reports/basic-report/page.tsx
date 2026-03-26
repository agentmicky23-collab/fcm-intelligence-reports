import { redirect } from "next/navigation";

// Insight detail page now redirects to main reports page (2-tier model)
export default function BasicReportPage() {
  redirect("/reports");
}
