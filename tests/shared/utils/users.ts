
interface User {
  password: string;
  reservaWebGeneralesVitalicio: string;
  reservaWebPlateasVitalicio: string;
  reservaInternaGeneralesVitalicio: string;
  reservaInternaPlateasVitalicio: string;
  socioAdherenteNo: string;
  socioVitaAbono: string;
  socioActivoCuota: string;
  vitaliciosGrupoFamiliar: string;
  socioActivoAbono: string;
  socioConfirmacionWeb: string;
  socioHabilitadoReservaWebPlateaConFamiliar: string;
  socioHabilitadoReservaInternaConFamiliar: string;
  socioReservaFiltroConDeuda: string;
  socioReservaFiltroConFamiliar: string;
  socioReservaFiltroSinFamiliar: string;
  socioReservaFiltro: string;
  socioReservaFiltroNoConFamiliarSi: string;
  socioContadorCuotas: string;
  socioTarjetasInternacionales: string;
  socioDAEstandoAlDia: string;
  socioDAConDeudaTarjeta: string;
  socioActivoAbonoSinDatosBancarios: string;
  socioDAConDeudaPaypal: string;
  socioDAconPaypalSinDeuda: string;
  paypalEmail: string;
  paypalPassword: string;
}

const users: User = {
    password: "Boca12345",
    reservaWebGeneralesVitalicio: "17061@mailinator.com",
    reservaWebPlateasVitalicio: "17351@mailinator.com",
    reservaInternaGeneralesVitalicio: "16010@mailinator.com",
    reservaInternaPlateasVitalicio: "14719@mailinator.com",
    socioAdherenteNo: "2178928@mailinator.com",
    socioVitaAbono: "9023@mailinator.com",
    socioActivoCuota: "96676@mailinator.com",
    vitaliciosGrupoFamiliar: "7789@mailinator.com",
    socioActivoAbono: "171920@mailinator.com",
    socioActivoAbonoSinDatosBancarios: "257820@mailinator.com",
    socioConfirmacionWeb: "169100@mailinator.com",
    socioHabilitadoReservaWebPlateaConFamiliar: "13274@mailinator.com",
    socioHabilitadoReservaInternaConFamiliar: "268791@mailinator.com",
    socioReservaFiltroConDeuda: "213720@mailinator.com",
    socioReservaFiltroConFamiliar: "208715@mailinator.com",
    socioReservaFiltroSinFamiliar: "211872@mailinator.com",
    socioReservaFiltroNoConFamiliarSi: "211871@mailinator.com",
    socioReservaFiltro: "213595@mailinator.com",
    socioContadorCuotas: "222478@mailinator.com",
    socioTarjetasInternacionales: "2214453@mailinator.com",
    socioDAEstandoAlDia: "163392@mailinator.com",
    socioDAConDeudaTarjeta: "191264@mailinator.com",
    socioDAConDeudaPaypal: "2106042@mailinator.com",
    socioDAconPaypalSinDeuda: "2215827@mailinator.com",
    paypalEmail: "testpaypal10@mailinator.com",
    paypalPassword: "Boca101010"
  };

  
export { users };