"use client";
import { Button, Flex } from "@chakra-ui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Cliente } from "../types/types";
dayjs.extend(customParseFormat);

function Dates({
  clients,
  isFileUploaded,
}: {
  clients: Cliente[];
  isFileUploaded: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const unplaggedIcon = new Image();
  unplaggedIcon.src = "/unplagged-icon.png";
  const efmarcoLogo = new Image();
  efmarcoLogo.src = "/efmarco-logo.png";
  const firmaSandra = new Image();
  firmaSandra.src = "/firmaSandra.png";
  const firmas = new Image();
  firmas.src = "/firmas.png";

  useEffect(() => {}, [loading]);

  const savePDF = (clients: Cliente[]) => {
    setLoading(true);

    setTimeout(() => {
      if (!isFileUploaded) {
        setLoading(false);
        return alert("Por favor, sube un archivo CSV antes de generar el PDF.");
      }

      const doc = new jsPDF();
      doc.addFont("/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
      doc.addFont("/fonts/Roboto/Roboto-Bold.ttf", "Roboto", "bold");
      doc.setFont("Roboto", "normal");

      let certificadoEnPagina = 0;
      let startY = 10;
      let iterationCount = 0;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let i = 0;

      clients.forEach((cliente: Cliente) => {
        i++;
        iterationCount++;

        let fechaEmision;

        if (Number(cliente.fecha.split("/")[0]) < 10) {
          fechaEmision = dayjs(cliente.fecha, "D/MM/YYYY");
        } else {
          fechaEmision = dayjs(cliente.fecha, "DD/MM/YYYY");
        }

        const daysToSubtract = Math.floor((iterationCount - 1) / 5);
        const fechaAux = fechaEmision
          .subtract(daysToSubtract, "day")
          .format("DD/MM/YYYY");

        if (certificadoEnPagina === 2) {
          doc.addPage();
          certificadoEnPagina = 0;
          startY = 10;
        }

        doc.setFontSize(9);
        doc.addImage(unplaggedIcon, "png", 10, startY, 20, 20);
        doc.text(`Fecha de Emisión: ${cliente.fecha}`, 150, startY + 5);
        doc.text(`Fecha de Trabajo: ${fechaAux}`, 150, startY + 10);
        doc
          .setFontSize(10)
          .setFont("Roboto", "bold")
          .text(`Certif. N° ${cliente.nro}`, 150, startY + 15)
          .setFont("Roboto", "normal");
        doc
          .setFont("Roboto", "bold")
          .text(
            "Sandra Sapoznik, Andrés Molina y Pablo Pozo S.H.",
            35,
            startY + 5
          )
          .setFont("Roboto", "normal");
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
        doc.addImage(efmarcoLogo, "png", 63, startY + 16, 23, 7);
        doc.text(`Cliente: ${cliente.nombre}`, 10, startY + 30);
        doc.text(`Dirección: ${cliente.dirección}`, 10, startY + 35);
        doc.text(
          `Localidad: ${cliente.localidad ? cliente.localidad : "Bahía Blanca"}`,
          100,
          startY + 35
        );

        const servicios = cliente.servicio.includes("/")
          ? cliente.servicio.split("/")
          : [cliente.servicio];

        const productos = cliente.productos.includes("/")
          ? cliente.productos.split("/")
          : [cliente.productos];

        const dosis = cliente.dosis.includes(" / ")
          ? cliente.dosis.split(" / ")
          : [cliente.dosis];

        const maxLength = Math.max(servicios.length, productos.length);

        while (servicios.length < maxLength) servicios.push("");
        while (productos.length < maxLength) productos.push("");
        while (dosis.length < maxLength) dosis.push("");

        const tableBody = servicios.map((servicio: string, index: number) => [
          servicio.trim(),
          productos[index].trim(),
          dosis[index].trim(),
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
      setLoading(false);
    }, 0);
  };

  return (
    <>
      <Flex
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Button
            p={4}
            m={4}
            onClick={() => savePDF(clients)}
            loading={loading}
            loadingText="Generando PDFs..."
          >
            Generar PDFs
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default Dates;
