import { redirect } from "next/navigation";
import { Link } from "./components/ui";

export default function Page() {
  redirect("/home");

  return (
    <main>
      <h2>Root Page</h2>
      <Link href={"/home"}> Link to home page...</Link>
    </main>
  );
}
