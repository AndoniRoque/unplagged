"use client";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { Cliente } from "../types/types";

interface ImportProps {
  setClients: React.Dispatch<React.SetStateAction<Cliente[]>>;
  setIsFileUploaded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Import({ setClients, setIsFileUploaded }: ImportProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "text/csv") {
      setFileName(file.name);
      setIsFileUploaded(true);

      Papa.parse<Cliente>(file, {
        complete: (results: Papa.ParseResult<Cliente>) => {
          console.log(results.data);
          setClients(results.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    } else {
      setIsFileUploaded(false);
      alert("Por favor, sube un archivo CSV válido");
    }
  };

  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      alignItems={"center"}
      m={4}
      flexDirection={"column"}
    >
      <Input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        display="none"
      />
      <Flex flexDirection={"column"}>
        <Button
          p={4}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Importar CSV
        </Button>
      </Flex>
      {fileName && (
        <Text mt={2} fontSize="sm" color="gray.600">
          Archivo: {fileName}
        </Text>
      )}
    </Flex>
  );
}

export default Import;
