import { auth } from "@/auth";
import MainClient from "./MainClient";

export default async function Page() {
  const session = await auth();
  
  return <MainClient session={session} />;
}