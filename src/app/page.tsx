"use client";
import { useState } from "react";
import Dates from "./components/Dates";
import Import from "./components/Import";

export default function Home() {
  const [clients, setClients] = useState([]);
  return (
    <>
      <Import setClients={setClients} />
      <Dates clients={clients} />
    </>
  );
}
