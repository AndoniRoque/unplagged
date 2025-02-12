"use client";
import { useState } from "react";
import Dates from "./components/Dates";
import Import from "./components/Import";
import { Flex, Image } from "@chakra-ui/react";
import { Cliente } from "./types/types";

export default function Home() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      h={"100vh"}
      flexDirection={"column"}
    >
      <Image
        alt="unplagged-logo"
        src="/unplagged-icon.png"
        boxSize={20}
        position={"absolute"}
        top={0}
        right={0}
      />
      <Flex
        flexDirection={"column"}
        border={"2px solid gray"}
        p={100}
        alignItems={"center"}
      >
        <Import setClients={setClients} setIsFileUploaded={setIsFileUploaded} />
        <Dates clients={clients} isFileUploaded={isFileUploaded} />
      </Flex>
    </Flex>
  );
}
