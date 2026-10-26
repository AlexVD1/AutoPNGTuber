const fs = require('fs');
const path = require('path');

const mappings = {
  '2026-10-21_agua_mar_deshidratacion.json': [
    'mar_abierto',
    'mar_abierto',
    'laboratorio',
    'interior_cuerpo',
    'interior_cuerpo',
    'interior_cuerpo',
    'laboratorio',
    'interior_cuerpo',
    'interior_cuerpo',
    'mar_abierto',
    'mar_abierto',
  ],
  '2026-10-21_agujero_negro_caida.json': [
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
    'espacio_profundo',
  ],
  '2026-10-21_bostezo_contagioso_cerebro.json': [
    'laboratorio_neuro',
    'sala_estar',
    'laboratorio_neuro',
    'sala_estar',
    'sala_estar',
    'laboratorio_neuro',
    'laboratorio_neuro',
    'cielo_dia',
    'laboratorio_neuro',
    'bosque_frio_nocturno',
    'laboratorio_neuro',
  ],
  '2026-10-21_cielo_azul_atardecer.json': [
    'cielo_dia',
    'cielo_dia',
    'cielo_dia',
    'cielo_dia',
    'laboratorio',
    'atardecer_dorado',
    'atardecer_dorado',
    'atardecer_dorado',
    'atardecer_dorado',
    'atardecer_dorado',
    'atardecer_dorado',
  ],
  '2026-10-21_curacion_expres.json': [
    'sala_estar',
    'laboratorio',
    'interior_cuerpo',
    'interior_cuerpo',
    'interior_cuerpo',
    'interior_cuerpo',
    'interior_cuerpo',
    'laboratorio',
    'interior_cuerpo',
    'laboratorio',
    'sala_estar',
  ],
  '2026-10-21_deja_vu_misterio_cerebro.json': [
    'sala_estar',
    'laboratorio_neuro',
    'laboratorio_neuro',
    'sala_estar',
    'laboratorio_neuro',
    'laboratorio_neuro',
    'laboratorio_neuro',
    'laboratorio_neuro',
    'sala_estar',
    'laboratorio_neuro',
    'sala_estar',
  ],
  '2026-10-21_delfines_dormir_respirar.json': [
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
    'laboratorio_neuro',
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
  ],
  '2026-10-21_impacto_monstruoso.json': [
    'tormenta_electrica',
    'tormenta_electrica',
    'tormenta_electrica',
    'tormenta_electrica',
    'tormenta_electrica',
    'tormenta_electrica',
    'tormenta_electrica',
    'tormenta_electrica',
    'interior_cuerpo',
    'tormenta_electrica',
    'tormenta_electrica',
  ],
  '2026-10-21_luna_desaparece_caos.json': [
    'espacio_profundo',
    'habitacion_noche',
    'bosque_frio_nocturno',
    'mar_abierto',
    'mar_abierto',
    'mar_abierto',
    'espacio_profundo',
    'espacio_profundo',
    'bosque_frio_nocturno',
    'tormenta_electrica',
    'espacio_profundo',
  ],
  '2026-10-21_piel_de_gallina.json': [
    'bosque_frio_nocturno',
    'bosque_frio_nocturno',
    'interior_cuerpo',
    'interior_cuerpo',
    'interior_cuerpo',
    'bosque_frio_nocturno',
    'bosque_frio_nocturno',
    'bosque_frio_nocturno',
    'sala_estar',
    'sala_estar',
    'bosque_frio_nocturno',
  ],
  '2026-10-21_reflejo_felino.json': [
    'sala_estar',
    'sala_estar',
    'laboratorio_neuro',
    'sala_estar',
    'laboratorio_neuro',
    'laboratorio_neuro',
    'sala_estar',
    'sala_estar',
    'sala_estar',
    'sala_estar',
    'sala_estar',
  ],
};

Object.entries(mappings).forEach(([filename, escList]) => {
  const filePath = path.join('archivo_videos', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const isDirect = Array.isArray(data);
  const escenas = isDirect ? data : (data.escenas || []);
  
  escenas.forEach((sc, idx) => {
    if (escList[idx]) {
      sc.escenario = escList[idx];
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated scenarios for ${filename}`);
});
