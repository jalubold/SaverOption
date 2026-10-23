import { BusinessSignIn } from "@/components/business/sign-in-card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sign in to Saver Option Business",
  description: "Sign in with Google to manage your company's software subscriptions, renewals and licenses.",
  path: "/business/login",
  noIndex: true,
});

export default async function BusinessLoginPage(props: PageProps<"/business/login">) {
  return <BusinessSignIn searchParams={await props.searchParams} mode="login" />;
}
