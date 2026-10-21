import { redirect } from "next/navigation";

/** Sign-up and sign-in are the same Google button, on /login. */
export default async function SignupPage(props: PageProps<"/signup">) {
  const { next } = await props.searchParams;
  redirect(typeof next === "string" ? `/login?next=${encodeURIComponent(next)}` : "/login");
}
