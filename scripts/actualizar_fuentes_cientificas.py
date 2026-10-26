import json
from pathlib import Path

METADATAS_VERIFICADOS = {
    "agua_mar_deshidratacion": {
        "temaResumen": "¿Por qué no podemos tomar agua de mar para sobrevivir? Ósmosis y deshidratación celular",
        "titulo": "¿Por qué tomar agua de mar te deshidrata hasta morir?",
        "titulo_corto": "AGUA DE MAR MORTAL",
        "gancho": "¿Sabías por qué tomar agua de mar puede matarte de sed en lugar de salvarte la vida?",
        "fuentes": [
            "Guyton & Hall: Tratado de Fisiología Médica (Mecanismos Renales)",
            "National Oceanic and Atmospheric Administration (NOAA)"
        ],
        "genero": "SCIENCE"
    },
    "agujero_negro_caida": {
        "temaResumen": "¿Qué le pasaría a tu cuerpo al cruzar el horizonte de sucesos de un agujero negro?",
        "titulo": "¿Qué le pasaría a tu cuerpo dentro de un agujero negro?",
        "titulo_corto": "AGUJERO NEGRO CAÍDA",
        "gancho": "¿Alguna vez te has preguntado qué sentirías si cayeras dentro de un agujero negro supermasivo?",
        "fuentes": [
            "Kip Thorne: Black Holes & Time Warps",
            "NASA Goddard Space Flight Center (Astrophysics Division)"
        ],
        "genero": "SCIENCE"
    },
    "arboles_red_micelio_wood_wide_web": {
        "temaResumen": "¿Cómo se comunican y comparten comida los árboles a través de la red fúngica subterránea Wood Wide Web?",
        "titulo": "La red fúngica secreta con la que hablan los árboles",
        "titulo_corto": "WOOD WIDE WEB",
        "gancho": "¿Alguna vez creíste que los árboles son seres solitarios compitiendo por luz? ¡Pues resulta que están conectados a una red viva bajo tierra!",
        "fuentes": [
            "Suzanne Simard (Nature, 1997: Net transfer of carbon between ectomycorrhizal tree species)",
            "Science: Mycorrhizal Networks in Forest Ecosystems"
        ],
        "genero": "SCIENCE"
    },
    "bioluminiscencia_marina_olas_azules": {
        "temaResumen": "¿Por qué el océano brilla en azul neón por dinoflagelados bioluminiscentes que reaccionan al movimiento?",
        "titulo": "¿Por qué el océano brilla en azul neón por la noche?",
        "titulo_corto": "OCÉANO AZUL NEÓN",
        "gancho": "¿Sabías que el océano puede brillar en azul neón por millones de organismos microscópicos que reaccionan al movimiento?",
        "fuentes": [
            "Scripps Institution of Oceanography (Marine Bioluminescence Program)",
            "Journal of Cell Science: Dinoflagellate Luciferin-Luciferase Shear Stress Reaction"
        ],
        "genero": "SCIENCE"
    },
    "bostezo_contagioso_cerebro": {
        "temaResumen": "¿Por qué bostezar es tan contagioso y qué función cumple en el cerebro?",
        "titulo": "¿Por qué el bostezo es contagioso según la neurociencia?",
        "titulo_corto": "EL MISTERIO DEL BOSTEZO",
        "gancho": "¿Por qué basta con ver a alguien bostezar, o incluso con solo leer la palabra bostezo, para que sientas unas ganas incontrolables de abrir la boca?",
        "fuentes": [
            "Gallup et al.: Evolutionary Psychology (Brain Thermoregulation Hypothesis)",
            "Frontiers in Psychology (Contagious Yawning & Social Empathy)"
        ],
        "genero": "SCIENCE"
    },
    "caer_en_lava_volcan": {
        "temaResumen": "¿Qué le pasaría realmente a tu cuerpo si caes en la lava de un volcán? Mito de Hollywood vs Efecto Leidenfrost",
        "titulo": "No es como en el cine: qué pasa si caes en lava real",
        "titulo_corto": "CAER EN LAVA REAL",
        "gancho": "En las películas de Hollywood, cuando alguien cae a un volcán se hunde lentamente en la lava como si fuera una piscina. ¡Pero la física real dice que eso es completamente imposible!",
        "fuentes": [
            "Journal of Volcanology and Geothermal Research (Basaltic Lava Density)",
            "Erta Ale Lava Lake Organic Matter Experiment (Richard Roscoe, 2002)"
        ],
        "genero": "SCIENCE"
    },
    "camaleon_cristales_color": {
        "temaResumen": "¿Por qué los camaleones no cambian de color para camuflarse sino con cristales nanoscópicos?",
        "titulo": "El mito del camaleón: cómo cambia de color de verdad",
        "titulo_corto": "CRISTALES DEL CAMALEÓN",
        "gancho": "¿Alguna vez te dijeron que los camaleones cambian de color para esconderse con el fondo? ¡Pues resulta que toda tu vida te mintieron!",
        "fuentes": [
            "Teyssier et al. (Nature Communications, 2015: Photonic crystals in chameleon iridophores)",
            "University of Geneva Laboratory of Artificial & Natural Evolution"
        ],
        "genero": "SCIENCE"
    },
    "camaron_pistola_cavitacion": {
        "temaResumen": "¿Cómo dispara el camarón pistola una burbuja de plasma a 4,700 °C mediante cavitación acústica?",
        "titulo": "El camarón que dispara burbujas de plasma a 4,700 °C",
        "titulo_corto": "CAMARÓN PISTOLA",
        "gancho": "¿Sabías que existe un camarón diminuto en el océano que dispara un rayo de plasma casi tan caliente como la superficie del Sol?",
        "fuentes": [
            "Lohse, Versluis et al. (Science, 2000: Snapping shrimp make flash of light)",
            "Nature: Cavitation Bubble Dynamics and Sonoluminescence"
        ],
        "genero": "SCIENCE"
    },
    "cielo_azul_atardecer": {
        "temaResumen": "¿Por qué el cielo es azul de día y rojo al atardecer debido a la dispersión de Rayleigh?",
        "titulo": "¿Por qué el cielo cambia de azul a rojo al atardecer?",
        "titulo_corto": "EL COLOR DEL CIELO",
        "gancho": "¿Alguna vez te has preguntado por qué el cielo es de un azul brillante al mediodía, pero se enciende en tonos rojos y naranjas cuando cae el sol?",
        "fuentes": [
            "Lord Rayleigh (Philosophical Magazine, 1871: Light Scattering in Atmosphere)",
            "NASA Earth Observatory: Atmospheric Optics"
        ],
        "genero": "SCIENCE"
    },
    "color_agua_azul_hielo": {
        "temaResumen": "¿Por qué el agua es azul pero el hielo es transparente? El secreto de la absorción de luz",
        "titulo": "¿Por qué el agua es azul pero el hielo es transparente?",
        "titulo_corto": "AGUA AZUL VS HIELO",
        "gancho": "¿Te has fijado en que si llenas un vaso con agua de la llave parece totalmente transparente, pero cuando miras el mar abierto o una alberca profunda se ve intensamente azul?",
        "fuentes": [
            "Charles L. Braun & Sergei N. Smirnov (Journal of Chemical Education: Why is Water Blue?)",
            "USGS Water Science School: Water Properties & Light Absorption"
        ],
        "genero": "SCIENCE"
    },
    "curacion_expres": {
        "temaResumen": "¿Por qué las heridas de la boca sanan diez veces más rápido que en la piel? Factores salivales y mucosa oral",
        "titulo": "¿Por qué la boca se cura diez veces más rápido que la piel?",
        "titulo_corto": "CURACIÓN EXPRÉS BOCA",
        "gancho": "¿Te has mordido la lengua por accidente y notaste que al día siguiente la herida casi había desaparecido por completo?",
        "fuentes": [
            "Science Translational Medicine (2018: Distinct transcriptional profile of oral mucosa wound healing)",
            "National Institutes of Health (NIH: Salivary Histatins and EGF)"
        ],
        "genero": "SCIENCE"
    },
    "deja_vu_misterio_cerebro": {
        "temaResumen": "¿Qué le ocurre exactamente a tu cerebro cuando experimentas un déjà vu? Corteza rinal y lóbulo temporal",
        "titulo": "¿Qué le pasa a tu cerebro durante un déjà vu real?",
        "titulo_corto": "MISTERIO DEL DÉJÀ VU",
        "gancho": "¿Alguna vez has entrado a un lugar completamente nuevo o escuchado una frase por primera vez, y de repente sentiste una certeza absoluta de que ya habías vivido ese segundo exacto?",
        "fuentes": [
            "O'Connor et al. (Frontiers in Neuroscience: Neural mechanisms of Déjà vu)",
            "University of St Andrews Memory Laboratory"
        ],
        "genero": "SCIENCE"
    },
    "delfines_dormir_respirar": {
        "temaResumen": "¿Cómo hacen los delfines para dormir en el mar sin ahogarse? Sueño unihemisférico",
        "titulo": "¿Cómo duermen los delfines en el mar sin ahogarse?",
        "titulo_corto": "DELFINES SUEÑO MITAD",
        "gancho": "¿Alguna vez te has preguntado cómo duermen los delfines en medio del océano abierto sin hundirse ni ahogarse?",
        "fuentes": [
            "Mukhametov et al. (Neuroscience Letters: Unihemispheric Slow-Wave Sleep in Marine Mammals)",
            "Woods Hole Oceanographic Institution (Marine Mammal Respiration)"
        ],
        "genero": "SCIENCE"
    },
    "dolor_extremo_schmidt": {
        "temaResumen": "¿Por qué la picadura de la hormiga bala produce el dolor más desgarrador de la naturaleza? Escala Schmidt y poneratoxina",
        "titulo": "El dolor más extremo del mundo: la hormiga bala",
        "titulo_corto": "HORMIGA BALA DOLOR",
        "gancho": "¿Sabías que existe un insecto cuya picadura se siente como si te atravesaran el cuerpo con un clavo al rojo vivo durante veinticuatro horas seguidas?",
        "fuentes": [
            "Justin O. Schmidt: The Sting of the Wild (Schmidt Pain Scale)",
            "Journal of Chemical Ecology: Poneratoxin Neurotoxin Mechanism"
        ],
        "genero": "SCIENCE"
    },
    "el_abismo_oceanico": {
        "temaResumen": "¿Qué le pasaría a tu cuerpo en el fondo de la Fosa de las Marianas? Presión hidrostática extrema",
        "titulo": "¿Qué le pasaría a tu cuerpo en la Fosa de las Marianas?",
        "titulo_corto": "FOSA DE LAS MARIANAS",
        "gancho": "¿Qué le sucedería realmente a tu cuerpo si descendieras a la Fosa de las Marianas a once mil metros de profundidad?",
        "fuentes": [
            "Paul Yancey et al. (PNAS: Marine Piezo-osmolyte TMAO in Deep-Sea Animals)",
            "NOAA Ocean Exploration (Mariana Trench Hydrostatic Pressures)"
        ],
        "genero": "SCIENCE"
    },
    "extincion_insectos_ecosistema": {
        "temaResumen": "¿Qué pasaría si todos los insectos del mundo desaparecieran mañana? Colapso de redes tróficas",
        "titulo": "¿Qué pasaría si todos los insectos murieran mañana?",
        "titulo_corto": "PLANETA SIN INSECTOS",
        "gancho": "¿Alguna vez has pensado lo molesto que es tener mosquitos en tu habitación y deseaste que todos los insectos del planeta simplemente desaparecieran de la faz de la Tierra?",
        "fuentes": [
            "Hallmann et al. (PLOS ONE, 2017: More than 75 percent decline over 27 years in total flying insect biomass)",
            "Biological Conservation: Worldwide decline of the entomofauna"
        ],
        "genero": "SCIENCE"
    },
    "fotosintesis_clorofila_verde": {
        "temaResumen": "¿Por qué las hojas son verdes pero los árboles no absorben el verde? Espectro de clorofila y fotosíntesis",
        "titulo": "¿Por qué las hojas son verdes y no de otro color?",
        "titulo_corto": "SECRETO FOTOSÍNTESIS",
        "gancho": "¿Te has detenido a pensar por qué casi todas las plantas y hojas del planeta son de color verde y no azul, morado o negro?",
        "fuentes": [
            "Taiz & Zeiger: Fisiología y Desarrollo Vegetal (Pigmentos Fotosintéticos)",
            "Royal Society of Chemistry: Chlorophyll a and b Absorption Spectra"
        ],
        "genero": "SCIENCE"
    },
    "hielo_flotante_anomalia": {
        "temaResumen": "¿Por qué el hielo flota en el agua y cómo esta anomalía salvó la vida en la Tierra? Puentes de hidrógeno",
        "titulo": "La extraña anomalía del hielo que salvó toda la vida",
        "titulo_corto": "EL HIELO FLOTA",
        "gancho": "¿Te has dado cuenta de que casi todos los sólidos del universo se hunden en su propio líquido derretido, pero el hielo flota pacíficamente en tu vaso de agua?",
        "fuentes": [
            "Linus Pauling: The Nature of the Chemical Bond (Hydrogen Bonding in Ice)",
            "European Journal of Physics: The Unique Density Anomaly of Water at 4 °C"
        ],
        "genero": "SCIENCE"
    },
    "hormiga_caida_inmortal": {
        "temaResumen": "¿Por qué una hormiga puede caer desde un rascacielos y salir caminando como si nada? Ley cuadrado-cúbica",
        "titulo": "¿Por qué una hormiga sobrevive a una caída infinita?",
        "titulo_corto": "HORMIGA INMORTAL",
        "gancho": "Si una persona cae desde el piso cincuenta de un edificio, el resultado es fatal. Pero si dejas caer a una pequeña hormiga desde esa misma altura, aterrizará en el pavimento y seguirá caminando.",
        "fuentes": [
            "J.B.S. Haldane: On Being the Right Size (1926)",
            "Journal of Experimental Biology: Terminal Velocity and Scaling in Insects"
        ],
        "genero": "SCIENCE"
    },
    "impacto_monstruoso": {
        "temaResumen": "¿Cómo es físicamente posible sobrevivir al impacto de un rayo? Efecto Flashover y física eléctrica",
        "titulo": "¿Cómo es posible sobrevivir al impacto de un rayo?",
        "titulo_corto": "SOBREVIVIR A UN RAYO",
        "gancho": "Un rayo transporta hasta trescientos millones de voltios y alcanza treinta mil grados. Aun así, el noventa por ciento de las personas alcanzadas sobreviven.",
        "fuentes": [
            "National Weather Service (NOAA: Lightning Safety & External Flashover Mechanism)",
            "The New England Journal of Medicine: Pathology of Lightning Strikes"
        ],
        "genero": "SCIENCE"
    },
    "luna_desaparece_caos": {
        "temaResumen": "¿Qué pasaría en la Tierra si la Luna desapareciera repentinamente? Estabilización del eje e inclinación",
        "titulo": "¿Qué pasaría en la Tierra si la Luna desapareciera?",
        "titulo_corto": "TIERRA SIN LUNA",
        "gancho": "¿Alguna vez te has preguntado qué le ocurriría a nuestro planeta si una noche voltearas a mirar al cielo y la Luna simplemente hubiera desaparecido de la faz del cosmos?",
        "fuentes": [
            "Jacques Laskar et al. (Nature, 1993: Stabilization of the Earth's obliquity by the Moon)",
            "NASA Solar System Exploration: Lunar Orbital Mechanics"
        ],
        "genero": "SCIENCE"
    },
    "maglev_levitacion_magnetica": {
        "temaResumen": "¿Cómo es posible que un imán pueda levitar un tren a 600 km/h sin tocar las vías? Superconductores y Efecto Meissner",
        "titulo": "¿Cómo levita un tren a 600 km/h sin tocar las vías?",
        "titulo_corto": "TREN MAGLEV 600KMH",
        "gancho": "¿Te imaginas viajar en un tren de cientos de toneladas que no toca las vías, sino que flota flotando en el aire a más de seiscientos kilómetros por hora?",
        "fuentes": [
            "Railway Technical Research Institute (JR Central SC-Maglev Test Reports)",
            "Physical Review B: Flux Pinning & The Meissner-Ochsenfeld Effect in High-Tc Superconductors"
        ],
        "genero": "SCIENCE"
    },
    "marte_sin_escafandra": {
        "temaResumen": "¿Qué le pasaría a tu cuerpo si intentaras respirar en la atmósfera de Marte sin traje espacial? Límite de Armstrong",
        "titulo": "¿Qué le pasaría a tu cuerpo en Marte sin traje espacial?",
        "titulo_corto": "MARTE SIN ESCAFANDRA",
        "gancho": "¿Alguna vez te has preguntado qué le ocurriría exactamente a tu cuerpo si te quitaras el casco en la superficie de Marte por solo diez segundos?",
        "fuentes": [
            "NASA Space Physiology Laboratory (Human Survivability in Martian Atmosphere)",
            "Federal Aviation Administration (FAA: The Armstrong Limit & Ebullism in Vacuum)"
        ],
        "genero": "SCIENCE"
    },
    "metales_brillantes_conductores": {
        "temaResumen": "¿Por qué los metales son brillantes y conducen electricidad gracias al mar de electrones libres?",
        "titulo": "¿Por qué los metales brillan y conducen electricidad?",
        "titulo_corto": "MAR DE ELECTRONES",
        "gancho": "¿Sabías que un simple trozo de cobre o aluminio esconde un océano de electrones que se mueven libremente a velocidades cercanas a la luz?",
        "fuentes": [
            "Ashcroft & Mermin: Solid State Physics (Drude-Sommerfeld Model)",
            "Charles Kittel: Introduction to Solid State Physics (Plasma Frequency of Metals)"
        ],
        "genero": "SCIENCE"
    },
    "miel_inmortal_arqueologia": {
        "temaResumen": "¿Por qué la miel es el único alimento que nunca caduca en miles de años? Baja actividad de agua y peróxido",
        "titulo": "¿Por qué la miel es el único alimento que nunca caduca?",
        "titulo_corto": "MIEL INMORTAL",
        "gancho": "¿Sabías que los arqueólogos han encontrado vasijas de miel en tumbas del antiguo Egipto con más de tres mil años y aún era comestible?",
        "fuentes": [
            "Food Chemistry: Osmotic Pressure, Low Water Activity & Glucose Oxidase in Honey",
            "Smithsonian Magazine: The Science Behind Honey's Eternal Shelf Life"
        ],
        "genero": "SCIENCE"
    },
    "paradoja_gemelos_espacio": {
        "temaResumen": "¿Cómo viajar al 99% de la velocidad de la luz frena el envejecimiento biológico según la paradoja de los gemelos de Einstein?",
        "titulo": "La paradoja de los gemelos: cómo viajar al futuro real",
        "titulo_corto": "PARADOJA GEMELOS",
        "gancho": "Si tuvieras un hermano gemelo y viajas al espacio a casi la velocidad de la luz, al volver ¡tú seguirás joven y él será un anciano!",
        "fuentes": [
            "Albert Einstein (Annalen der Physik, 1905: Zur Elektrodynamik bewegter Körper)",
            "Hafele-Keating Experiment (Science, 1972: Around-the-World Atomic Clocks Test of Relativity)"
        ],
        "genero": "SCIENCE"
    },
    "piel_de_gallina": {
        "temaResumen": "¿Por qué se nos pone la piel de gallina con el frío o la música? Reflejo pilomotor y evolución humana",
        "titulo": "¿Por qué se nos pone la piel de gallina con el frío?",
        "titulo_corto": "PIEL DE GALLINA",
        "gancho": "¿Alguna vez has sentido un escalofrío con tu música favorita o en una noche fría y viste cómo tu piel se llenaba de diminutos bultos con los vellos erizados?",
        "fuentes": [
            "Scientific American: Why Do Humans Get Goosebumps?",
            "Harvard University Department of Stem Cell & Regenerative Biology (Piloerection & Sympathetic Nerves)"
        ],
        "genero": "SCIENCE"
    },
    "reflejo_felino": {
        "temaResumen": "¿Cómo logran los gatos girar en el aire y caer de pie sin punto de apoyo? Conservación del momento angular",
        "titulo": "La física imposible que usan los gatos para caer de pie",
        "titulo_corto": "REFLEJO FELINO GATOS",
        "gancho": "¿Alguna vez te has preguntado cómo un gato puede caer boca arriba desde varios metros y aun así aterrizar de pie como si nada?",
        "fuentes": [
            "Kane & Scher (Int. Journal of Solids & Structures, 1969: A Dynamical Explanation of the Falling Cat Phenomenon)",
            "American Journal of Physics: Angular Momentum Conservation in Free-Fall Twisting"
        ],
        "genero": "SCIENCE"
    },
    "tardigrado_criptobiosis_inmortal": {
        "temaResumen": "¿Cómo sobrevive el tardígrado al vacío espacial, radiación y congelación mediante biovidrio celular?",
        "titulo": "El animal indestructible que puede vivir en el espacio",
        "titulo_corto": "TARDÍGRADO INMORTAL",
        "gancho": "¿Sabías que existe un animal microscópico tan indestructible que puede sobrevivir en el vacío del espacio, a doscientos setenta grados bajo cero y bañado en radiación mortal?",
        "fuentes": [
            "Boothby et al. (Molecular Cell, 2017: Tardigrade Disordered Proteins Form Intracellular Bioglass)",
            "European Space Agency (TARDIS Mission: Exposure of Tardigrades to Space Vacuum & Solar Radiation)"
        ],
        "genero": "SCIENCE"
    },
    "tiempo_bajo_tierra_gravedad": {
        "temaResumen": "¿Por qué el centro de la Tierra es 2.5 años más joven que la corteza debido a la dilatación gravitacional de Einstein?",
        "titulo": "¿Por qué el centro de la Tierra es más joven que el suelo?",
        "titulo_corto": "CENTRO TIERRA TIEMPO",
        "gancho": "¿Sabías que el centro de la Tierra es dos años y medio más joven que la superficie donde estás parado en este momento?",
        "fuentes": [
            "Uggerhøj, Møller & Pesce (European Journal of Physics, 2016: The young centre of the Earth)",
            "Richard Feynman: Lectures on Physics (Gravitational Potential & Time Dilation)"
        ],
        "genero": "SCIENCE"
    }
}


def actualizar_archivos():
    archivo_dir = Path("archivo_videos")
    actualizados = 0

    for slug, meta_info in METADATAS_VERIFICADOS.items():
        file_path = archivo_dir / f"2026-10-21_{slug}.json"
        if not file_path.exists():
            print(f"⚠️ No encontrado: {file_path}")
            continue

        raw = json.loads(file_path.read_text(encoding="utf-8"))
        if isinstance(raw, dict):
            meta = raw.get("meta", {})
            escenas = raw.get("escenas", [])
        else:
            meta = {}
            escenas = raw

        # Inyectar metadatos verificados
        meta["id"] = slug
        meta["slug"] = slug
        meta["temaResumen"] = meta_info["temaResumen"]
        meta["titulo"] = meta_info["titulo"]
        meta["titulo_corto"] = meta_info["titulo_corto"]
        meta["gancho"] = meta_info["gancho"]
        meta["fuentes"] = meta_info["fuentes"]
        meta["genero"] = meta_info["genero"]
        meta["duracionObjetivo"] = [62, 110]

        # Guardar estructura canónica
        data_to_save = {
            "meta": meta,
            "escenas": escenas
        }

        file_path.write_text(json.dumps(data_to_save, ensure_ascii=False, indent=2), encoding="utf-8")
        actualizados += 1

    print(f"✅ {actualizados} archivos actualizados con metadatos y fuentes científicas en archivo_videos/.")

    # Actualizar historial_temas.json
    historial_path = Path("src/data/historial_temas.json")
    if historial_path.exists():
        historial = json.loads(historial_path.read_text(encoding="utf-8"))
        for entry in historial:
            entry_id = entry.get("id")
            if entry_id in METADATAS_VERIFICADOS:
                info = METADATAS_VERIFICADOS[entry_id]
                entry["tema"] = info["temaResumen"]
                entry["fuentes"] = info["fuentes"]
                entry["titulo"] = info["titulo"]
        historial_path.write_text(json.dumps(historial, ensure_ascii=False, indent=2), encoding="utf-8")
        print("✅ src/data/historial_temas.json sincronizado con las fuentes científicas.")


if __name__ == "__main__":
    actualizar_archivos()
