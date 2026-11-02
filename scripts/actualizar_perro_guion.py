import json

with open("src/data/guion.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ESCENA 3 (id: 3): El Mictlán no era un castigo...
escena3 = data["escenas"][2]
escena3["personajes"] = [
    {
        "id": "stickman_alma",
        "nombre": "Stickman Alma",
        "posicion": { "x": -180, "y": 60 },
        "escala": 1.0,
        "orientacion": "derecha",
        "colorRim": "#FDE047",
        "halo": True,
        "habla": True,
        "capaZ": 20,
        "acciones": [
            {
                "tipo": "personalizada",
                "pasos": [
                    {
                        "inicioProgreso": 0,
                        "finProgreso": 0.3,
                        "poseId": "standing_relaxed",
                        "expresion": "analytical",
                        "posicion": { "x": -180, "y": 60 },
                        "curva": "suave",
                        "procedural": "estatico"
                    },
                    {
                        "inicioProgreso": 0.3,
                        "finProgreso": 0.7,
                        "poseId": "acariciando_perro",
                        "expresion": "smile_soft",
                        "posicion": { "x": -140, "y": 80 },
                        "curva": "suave",
                        "procedural": "estatico"
                    },
                    {
                        "inicioProgreso": 0.7,
                        "finProgreso": 1.0,
                        "poseId": "walking",
                        "expresion": "smile_wide",
                        "posicion": { "x": -60, "y": 70 },
                        "curva": "suave",
                        "procedural": "caminar"
                    }
                ]
            }
        ]
    }
]
escena3["objetos"] = [
    {
        "id": "perro_xolo_mictlan",
        "propId": "perro_xoloitzcuintle",
        "posicion": { "x": 160, "y": 210 },
        "escala": 2.2,
        "capaZ": 28,
        "pasos": [
            {
                "inicioProgreso": 0,
                "finProgreso": 0.32,
                "desdePosicion": { "x": 180, "y": 210 },
                "posicion": { "x": 40, "y": 210 },
                "estado": "caminar",
                "curva": "suave"
            },
            {
                "inicioProgreso": 0.32,
                "finProgreso": 0.7,
                "posicion": { "x": 20, "y": 210 },
                "estado": "acariciar",
                "curva": "suave"
            },
            {
                "inicioProgreso": 0.7,
                "finProgreso": 1.0,
                "desdePosicion": { "x": 20, "y": 210 },
                "posicion": { "x": 180, "y": 230 },
                "estado": "caminar",
                "curva": "suave"
            }
        ]
    }
]

# ESCENA 4 (id: 4): Cada nivel era una prueba...
escena4 = data["escenas"][3]
escena4["personajes"] = [
    {
        "id": "stickman_alma_esquiva",
        "nombre": "Stickman Alma",
        "posicion": { "x": -180, "y": 70 },
        "escala": 1.0,
        "orientacion": "derecha",
        "colorRim": "#FDE047",
        "halo": True,
        "habla": True,
        "capaZ": 20,
        "acciones": [
            {
                "tipo": "personalizada",
                "pasos": [
                    {
                        "inicioProgreso": 0,
                        "finProgreso": 0.35,
                        "poseId": "running_escape",
                        "expresion": "shocked",
                        "posicion": { "x": -240, "y": 60 },
                        "curva": "impacto",
                        "procedural": "correr"
                    },
                    {
                        "inicioProgreso": 0.35,
                        "finProgreso": 0.7,
                        "poseId": "protecting_shielding",
                        "expresion": "scared",
                        "posicion": { "x": -140, "y": 75 },
                        "curva": "suave",
                        "procedural": "temblar"
                    },
                    {
                        "inicioProgreso": 0.7,
                        "finProgreso": 1.0,
                        "poseId": "crouching",
                        "expresion": "talking",
                        "posicion": { "x": -60, "y": 80 },
                        "curva": "suave",
                        "procedural": "esfuerzo"
                    }
                ]
            }
        ]
    }
]
escena4["objetos"] = [
    {
        "id": "perro_xolo_guia_obstaculos",
        "propId": "perro_xoloitzcuintle",
        "posicion": { "x": 40, "y": 210 },
        "escala": 2.2,
        "capaZ": 28,
        "pasos": [
            {
                "inicioProgreso": 0,
                "finProgreso": 0.4,
                "desdePosicion": { "x": 20, "y": 210 },
                "posicion": { "x": 100, "y": 140 },
                "animacion": "rebotar",
                "estado": "caminar",
                "curva": "rebote"
            },
            {
                "inicioProgreso": 0.4,
                "finProgreso": 1.0,
                "desdePosicion": { "x": 100, "y": 140 },
                "posicion": { "x": 240, "y": 210 },
                "estado": "caminar",
                "curva": "suave"
            }
        ]
    }
]

# ESCENA 6 (id: 6): Al cabo de cuatro años...
escena6 = data["escenas"][5]
escena6["personajes"] = [
    {
        "id": "stickman_alma_paz",
        "nombre": "Stickman Alma",
        "posicion": { "x": -140, "y": 110 },
        "escala": 1.0,
        "orientacion": "derecha",
        "colorRim": "#FDE047",
        "halo": True,
        "habla": True,
        "capaZ": 20,
        "acciones": [
            {
                "tipo": "personalizada",
                "pasos": [
                    {
                        "inicioProgreso": 0,
                        "finProgreso": 0.35,
                        "poseId": "standing_relaxed",
                        "expresion": "talking",
                        "posicion": { "x": -140, "y": 80 },
                        "curva": "suave",
                        "procedural": "estatico"
                    },
                    {
                        "inicioProgreso": 0.35,
                        "finProgreso": 0.75,
                        "poseId": "acariciando_perro",
                        "expresion": "smile_soft",
                        "posicion": { "x": -130, "y": 130 },
                        "curva": "suave",
                        "procedural": "estatico"
                    },
                    {
                        "inicioProgreso": 0.75,
                        "finProgreso": 1.0,
                        "poseId": "sitting",
                        "expresion": "smile_soft",
                        "posicion": { "x": -130, "y": 140 },
                        "curva": "suave",
                        "procedural": "estatico"
                    }
                ]
            }
        ]
    }
]
escena6["objetos"] = [
    {
        "id": "perro_xolo_descanso_final",
        "propId": "perro_xoloitzcuintle",
        "posicion": { "x": 40, "y": 220 },
        "escala": 2.2,
        "capaZ": 28,
        "pasos": [
            {
                "inicioProgreso": 0,
                "finProgreso": 0.35,
                "posicion": { "x": 40, "y": 220 },
                "estado": "sentado",
                "curva": "suave"
            },
            {
                "inicioProgreso": 0.35,
                "finProgreso": 0.75,
                "posicion": { "x": 30, "y": 220 },
                "estado": "acariciar",
                "curva": "suave"
            },
            {
                "inicioProgreso": 0.75,
                "finProgreso": 1.0,
                "posicion": { "x": 30, "y": 220 },
                "estado": "sentado",
                "curva": "suave"
            }
        ]
    }
]

with open("src/data/guion.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("guion.json updated with single stickman + large animated xolo companion in objetos!")
