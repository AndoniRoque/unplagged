"use client";
import { useState } from "react";
import Dates from "./components/Dates";
import Import from "./components/Import";
import { Flex } from "@chakra-ui/react";

export default function Home() {
  const [clients, setClients] = useState([]);
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      h={"100vh"}
      flexDirection={"column"}
    >
      <Import setClients={setClients} />
      <Dates clients={clients} />
    </Flex>
  );
}
