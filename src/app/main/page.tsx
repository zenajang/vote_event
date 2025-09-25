import { Suspense } from "react";
import MainClient from "./MainClient";

export default async function Page() {
  return (
  <Suspense fallback={null} >
    <MainClient />;
  </Suspense>
)}
