import { BusinessSignIn } from "@/components/business/sign-in-card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Get started with Saver Option Business",
  description: "Create your Saver Option Business account with Google and start tracking your company's software spending.",
  path: "/business/signup",
  noIndex: true,
});

export default async function BusinessSignupPage(props: PageProps<"/business/signup">) {
  return <BusinessSignIn searchParams={await props.searchParams} mode="signup" />;
}
