"use client";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from "react";
import dayjs from "dayjs";

function Dates({ clients }) {
  const [fechaEmision, setFechaEmision] = useState<string>("");
  const [fechaTrabajo, setfechaTrabajo] = useState<string>("");
  const img = new Image();
  img.src = "/unplagged-icon.png";

  const savePDF = (clients) => {
    clients.forEach((cliente: string) => {
      const doc = new jsPDF();
      doc.setProperties({
        title: `${cliente.NRO}.pdf`,
      });
      doc.setFontSize(10);
      doc.addImage(img, "png", 10, 10, 20, 20);
      doc.text(
        `Fecha de Emisión: ${dayjs(fechaEmision).format("DD-MM-YYYY")}`,
        150,
        15
      );
      doc.text(
        `Fecha de Trabajo: ${dayjs(fechaTrabajo).format("DD-MM-YYYY")}`,
        150,
        20
      );
      doc.text("Sandra Sapoznik, Andrés Molina y Pablo Pozo S.H.", 40, 15);
      doc.text("Ing.Luiggi 1448 - Bahía Blanca, Buenos Aires.", 40, 20);
      doc.text(
        "Tel.: 0291-154706376 | e-mail: sandra_sapoznik@efmarco.com",
        40,
        25
      );
      doc.text("Bajo licencia de Efmarco", 40, 30);
      doc.text(`Cliente: ${cliente.NOMBRE}`, 10, 45);
      doc.text(`Dirección: ${cliente.DIRECCIÓN}`, 10, 50);
      doc.text("Localidad: Bahía Blanca", 100, 50);

      const servicios = cliente.SERVICIO.includes("/")
        ? cliente.SERVICIO.split("/")
        : [cliente.SERVICIO];

      const productos = cliente.PRODUCTOS.includes("/")
        ? cliente.PRODUCTOS.split("/")
        : [cliente.PRODUCTOS];

      const maxLength = Math.max(servicios.length, productos.length);

      while (servicios.length < maxLength) servicios.push("");
      while (productos.length < maxLength) productos.push("");

      // 📌 Construir el cuerpo de la tabla con los servicios divididos
      const tableBody = servicios.map((servicio, index) => [
        servicio.trim(), // 🔹 SERVICIO
        productos[index].trim(), // 🔹 PRODUCTO
        "10 c/l", // 🔹 Dosis
        "M", // 🔹 Aplicación
      ]);

      autoTable(doc, {
        startY: 55,
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

      doc.save(`${cliente.NRO}.pdf`);
    });
  };

  return (
    <>
      <Flex
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Flex w={500} p={4} alignItems={"center"}>
          <Text w={300}>Fecha de Emisión</Text>
          <Input
            type="date"
            w={415}
            p={2}
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.target.value)}
          />
        </Flex>
        <Flex w={500} p={4} alignItems={"center"}>
          <Text w={300}>Fecha de Trabajo</Text>
          <Input
            type="date"
            w={415}
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
