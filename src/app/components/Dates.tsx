"use client";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from "react";
import dayjs from "dayjs";

interface Cliente {
  PRODUCTOS: string;
  NOMBRE: string;
  NRO: string;
  DIRECCIÓN: string;
  SERVICIO: string;
}

function Dates({ clients }: { clients: Cliente[] }) {
  const [fechaEmision, setFechaEmision] = useState<string>("");
  const [fechaTrabajo, setfechaTrabajo] = useState<string>("");
  const unplaggedIcon = new Image();
  unplaggedIcon.src = "/unplagged-icon.png";
  // const efmarcoIcon = new Image();
  // efmarcoIcon.src = "/efmarco-icon.png";
  const firmaSandra = new Image();
  firmaSandra.src = "/firmaSandra.png";
  const firmas = new Image();
  firmas.src = "/firmas.png";
  let i = 0;

  const savePDF = (clients: Cliente[]) => {
    if (fechaEmision === "" && fechaTrabajo === "") {
      return alert("Por favor complete las fechas de emisión y trabajo.");
    }

    const doc = new jsPDF();
    let fechaTrabajoActual = dayjs(fechaTrabajo);
    let certificadoEnPagina = 0;
    let startY = 10;

    clients.forEach((cliente: Cliente, index: number) => {
      i++;

      if (certificadoEnPagina === 2) {
        doc.addPage();
        certificadoEnPagina = 0;
        startY = 10;
      }

      if (i % 5 === 0) {
        fechaTrabajoActual = fechaTrabajoActual.subtract(1, "day");
      }

      doc.setFontSize(8);
      doc.addImage(unplaggedIcon, "png", 10, startY, 20, 20);
      doc.text(
        `Fecha de Emisión: ${dayjs(fechaEmision).format("DD-MM-YYYY")}`,
        150,
        startY + 5
      );
      doc.text(
        `Fecha de Trabajo: ${fechaTrabajoActual.format("DD-MM-YYYY")}`,
        150,
        startY + 10
      );
      doc
        .setFontSize(10)
        .setFont(undefined, "bold")
        .text(`Certif. N° ${cliente.NRO}`, 150, startY + 15)
        .setFont(undefined, "normal");
      doc
        .setFont(undefined, "bold")
        .text(
          "Sandra Sapoznik, Andrés Molina y Pablo Pozo S.H.",
          35,
          startY + 5
        )
        .setFont(undefined, "normal");
      doc.text(
        "Ing.Luiggi 1448 - Bahía Blanca, Buenos Aires.",
        35,
        startY + 10
      );
      doc.text(
        "Tel.: 0291-154706376 | e-mail: sandra_sapoznik@efmarco.com",
        35,
        startY + 15
      );
      doc.text("Representantes", 35, startY + 20);
      // doc.addImage(unplaggedIcon, "png", ); EFMARCO LOGO
      doc.text(`Cliente: ${cliente.NOMBRE}`, 10, startY + 30);
      doc.text(`Dirección: ${cliente.DIRECCIÓN}`, 10, startY + 35);
      doc.text("Localidad: Bahía Blanca", 100, startY + 35);

      const servicios = cliente.SERVICIO.includes("/")
        ? cliente.SERVICIO.split("/")
        : [cliente.SERVICIO];

      const productos = cliente.PRODUCTOS.includes("/")
        ? cliente.PRODUCTOS.split("/")
        : [cliente.PRODUCTOS];

      const maxLength = Math.max(servicios.length, productos.length);

      while (servicios.length < maxLength) servicios.push("");
      while (productos.length < maxLength) productos.push("");

      const tableBody = servicios.map((servicio: string, index: number) => [
        servicio.trim(),
        productos[index].trim(),
        "10 c/l",
        "M",
      ]);

      while (tableBody.length < 3) {
        tableBody.push(["", "", "", ""]);
      }

      autoTable(doc, {
        startY: startY + 40,
        head: [
          ["Tratamiento", "Producto", "Dosis", "Aplic.", "Sectores Tratados"],
        ],
        theme: "grid",
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
        },
        body: tableBody,
      });

      autoTable(doc, {
        startY: startY + 75,
        head: [["Municipalidad"]],
        theme: "grid",
        margin: {
          left: 111,
        },
        styles: {
          halign: "center",
          valign: "bottom",
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          minCellHeight: 50,
          cellWidth: 85,
        },
      });

      doc.addImage(firmas, "png", -70, startY + 30, 220, 130);
      doc.addImage(firmaSandra, "png", -35, startY + 34, 220, 130);

      certificadoEnPagina++;
      startY += 145;
    });
    doc.save(`Certificados.pdf`);
  };

  return (
    <>
      <Flex
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Flex w={500} p={4} alignItems={"left"} flexDirection={"column"}>
          <Text w={200}>Fecha de Emisión:</Text>
          <Input
            type="date"
            p={2}
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.target.value)}
          />
        </Flex>
        <Flex w={500} p={4} alignItems={"left"} flexDirection={"column"}>
          <Text w={200}>Fecha de Trabajo:</Text>
          <Input
            type="date"
            p={2}
            value={fechaTrabajo}
            onChange={(e) => setfechaTrabajo(e.target.value)}
          />
        </Flex>
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Button p={4} m={4} onClick={() => savePDF(clients)}>
            Generar PDFs
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Dates;
