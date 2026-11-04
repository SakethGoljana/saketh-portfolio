import { notFound } from "next/navigation";
import ErrorCrashTrigger from "./ErrorCrashTrigger";

export const dynamic = "force-dynamic";

export default function ErrorTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ErrorCrashTrigger />;
}
