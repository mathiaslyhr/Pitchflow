import { redirect } from "next/navigation";

// The landing/showcase page ships in sub-project 4. Until then, the root
// sends visitors straight to the board.
export default function Home() {
  redirect("/board");
}
