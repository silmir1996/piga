
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
    socioConfirmacionWeb: "169100@mailinator.com",
    socioHabilitadoReservaWebPlateaConFamiliar: "13274@mailinator.com",
    socioHabilitadoReservaInternaConFamiliar: "268791@mailinator.com"
  };
  
export { users };