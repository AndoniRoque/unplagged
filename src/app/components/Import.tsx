"use client";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Papa from "papaparse";

interface Cliente {
  PRODUCTOS: string;
  NOMBRE: string;
  NRO: string;
  DIRECCIÓN: string;
  SERVICIO: string;
}

interface ImportProps {
  setClients: React.Dispatch<React.SetStateAction<Cliente[]>>;
}

function Import({ setClients }: ImportProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "text/csv") {
      setFileName(file.name);

      Papa.parse<Cliente>(file, {
        complete: (results: Papa.ParseResult<Cliente>) => {
          console.log(results.data);
          setClients(results.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    } else {
      alert("Por favor,  sube un archivo CSV válido");
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
      <Button
        p={4}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        Importar CSV
      </Button>
      {fileName && (
        <Text mt={2} fontSize="sm" color="gray.600">
          Archivo: {fileName}
        </Text>
      )}
    </Flex>
  );
}

export default Import;
