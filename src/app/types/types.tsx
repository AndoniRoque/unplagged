export interface Cliente {
  productos: string;
  nombre: string;
  nro: string;
  dirección: string;
  servicio: string;
  localidad: string;
  dosis: string;
  fecha: string;
  ["fecha de servicio"]: string;
  ["sectores tratados"]: string;
}
