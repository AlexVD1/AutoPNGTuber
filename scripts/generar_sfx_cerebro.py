import os
import wave
import struct
import math
import random

SAMPLE_RATE = 44100

def guardar_wav(ruta_wav, samples, volumen=0.85):
    os.makedirs(os.path.dirname(os.path.abspath(ruta_wav)), exist_ok=True)
    max_val = max(abs(s) for s in samples) if samples else 1.0
    norm_factor = (32767 * volumen) / max(max_val, 1e-5)
    with wave.open(ruta_wav, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for s in samples:
            val_int = int(max(-32767, min(32767, s * norm_factor)))
            frames.extend(struct.pack("<h", val_int))
        wav.writeframes(frames)
    print(f"[SFX OK] {ruta_wav} ({len(samples)/SAMPLE_RATE:.2f}s)")

# 1. Suspiro de cama + proyector de película antigua + eco de risas
def synth_suspiro_proyector_cine_risas(duration=1.05):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Suspiro inicial suave (0.0 a 0.25s)
        if t < 0.25:
            p_sigh = t / 0.25
            air = (random.random() * 2 - 1) * math.sin(math.pi * p_sigh) * 0.2
            tone = math.sin(2 * math.pi * 180 * t) * math.sin(math.pi * p_sigh) * 0.15
            val += air + tone
        # Proyector mecánico de carrete antiguo (0.28 a 0.85s) whirrr-clack-clack
        if 0.28 <= t < 0.85:
            dt = t - 0.28
            # Shutter clicks a 18 fps
            frame_click = (int(dt * 18)) % 2 == 0
            click_env = math.exp(-70 * ((dt * 18) % 1.0))
            gear = (random.random() * 2 - 1) * click_env * 0.5
            motor = math.sin(2 * math.pi * 320 * dt) * 0.15
            val += gear + motor
        # Risas en eco distorsionadas (0.65 a 1.05s)
        if t >= 0.65:
            dt_l = t - 0.65
            p_l = dt_l / 0.40
            laugh_burst = math.sin(2 * math.pi * 7 * dt_l)
            if laugh_burst > 0.2:
                freq_l = 380 + 120 * math.sin(2 * math.pi * 4 * dt_l)
                env_l = math.sin(math.pi * p_l) * 0.4
                val += math.sin(2 * math.pi * freq_l * dt_l) * env_l
        samples.append(val)
    return samples

# 2. Quejido almohada + bostezo caricatura + golpe escritorio thud + ronquido zzz
def synth_quejido_bostezo_guardia_ronquido(duration=1.1):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Bostezo caricatura en descenso (0.0 a 0.45s)
        if t < 0.45:
            p_y = t / 0.45
            freq_y = 480 * math.pow(1 - p_y, 0.7) + 140
            env_y = math.sin(math.pi * p_y) * 0.6
            val += math.sin(2 * math.pi * freq_y * t) * env_y
        # Golpe de cabeza en escritorio thud seco (0.45 a 0.65s)
        if 0.45 <= t < 0.65:
            dt_th = t - 0.45
            p_th = dt_th / 0.20
            thud = math.sin(2 * math.pi * (80 * math.exp(-15 * p_th) + 45) * dt_th) * math.exp(-12 * p_th)
            val += thud * 1.1
        # Ronquido cómico zzz con burbuja (0.65 a 1.1s)
        if t >= 0.65:
            dt_sn = t - 0.65
            p_sn = dt_sn / 0.45
            freq_sn = 65 + 15 * math.sin(2 * math.pi * 3.5 * dt_sn)
            buzz = (1.0 if math.sin(2 * math.pi * freq_sn * dt_sn) > 0 else -1.0) * 0.3
            noise = (random.random() * 2 - 1) * 0.15
            env_sn = math.sin(math.pi * p_sn) * 0.6
            val += (buzz + noise) * env_sn
        samples.append(val)
    return samples

# 3. Sirena de submarino AWOOGA + crujido palanca + alarma roja
def synth_alarma_submarino_palanca_panico(duration=1.05):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Crujido palanca metálica clack (0.0 a 0.18s)
        if t < 0.18:
            env_c = math.exp(-40 * t)
            val += math.sin(2 * math.pi * 1200 * t) * env_c * 0.6
            val += (random.random() * 2 - 1) * env_c * 0.3
        # Dos pulsos de bocina de alarma AWOOGA (0.18 a 1.05s)
        if t >= 0.18:
            dt_a = (t - 0.18) % 0.42
            p_a = dt_a / 0.42
            if p_a < 0.85:
                # Barrido tonal de 240Hz subiendo rápido a 480Hz
                freq_a = 240 + 260 * math.pow(p_a / 0.85, 0.8)
                env_a = math.sin(math.pi * (p_a / 0.85)) * 0.85
                horn = math.sin(2 * math.pi * freq_a * t) + 0.4 * math.sin(2 * math.pi * freq_a * 2 * t)
                val += horn * env_a
        samples.append(val)
    return samples

# 4. Engranajes oxidados rechinando creeeak-grind + chispas oscuras
def synth_engranajes_oxidados_chispas_ansiedad(duration=1.1):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Rechinido de metal oxidado (FM modulation áspera)
        mod = math.sin(2 * math.pi * 180 * t) * 160
        carrier = math.sin(2 * math.pi * (750 + mod) * t) * 0.6
        # Fricción áspera mecánica
        friction = (random.random() * 2 - 1) * (0.4 if (int(t * 12)) % 2 == 0 else 0.1)
        # Zumbido de alarma cerebral de alta frecuencia
        hum_high = math.sin(2 * math.pi * 2200 * t) * 0.12 * math.sin(2 * math.pi * 5 * t)
        env = math.sin(math.pi * (t / duration))
        val += (carrier + friction + hum_high) * env * 0.85
        samples.append(val)
    return samples

# 5. Viento nocturno de cueva + chasquido ramas + rugido bajo tigre grrrrr
def synth_viento_cueva_ramas_gruñido_tigre(duration=1.15):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Viento frío de cueva (0.0 a 0.5s)
        if t < 0.6:
            p_w = t / 0.6
            wind = (random.random() * 2 - 1) * math.sin(2 * math.pi * 90 * t) * 0.3 * math.sin(math.pi * p_w)
            val += wind
        # Chasquido de rama seca (0.25 a 0.35s)
        if 0.25 <= t < 0.35:
            dt_b = t - 0.25
            snap = (random.random() * 2 - 1) * math.exp(-80 * dt_b) * 0.7
            val += snap
        # Rugido gutural grave de tigre dientes de sable (0.45 a 1.15s)
        if t >= 0.45:
            dt_g = t - 0.45
            p_g = dt_g / 0.70
            freq_g = 75 + 25 * math.sin(2 * math.pi * 12 * dt_g)
            growl = (math.sin(2 * math.pi * freq_g * dt_g) + 0.6 * math.sin(2 * math.pi * freq_g * 1.5 * dt_g))
            noise_growl = (random.random() * 2 - 1) * 0.4
            env_g = math.sin(math.pi * p_g) * (1.0 - p_g * 0.4)
            val += (growl + noise_growl) * env_g * 0.95
        samples.append(val)
    return samples

# 6. Disolución de humo poof + suspiro de alivio + apagado de alarma
def synth_disolucion_humo_alivio_facturas(duration=1.0):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Disolución poof de aire comprimido (0.0 a 0.35s)
        if t < 0.35:
            p_p = t / 0.35
            poof = (random.random() * 2 - 1) * math.exp(-12 * p_p) * 0.6
            sub_pop = math.sin(2 * math.pi * 110 * t) * math.exp(-18 * p_p) * 0.4
            val += poof + sub_pop
        # Sirena apagándose en tono descendente (0.15 a 0.6s)
        if 0.15 <= t < 0.6:
            dt_s = t - 0.15
            p_s = dt_s / 0.45
            freq_s = 600 * math.pow(1 - p_s, 2) + 120
            env_s = math.pow(1 - p_s, 1.5) * 0.3
            val += math.sin(2 * math.pi * freq_s * dt_s) * env_s
        # Suspiro dulce de comprensión (0.5 a 0.95s)
        if t >= 0.5:
            dt_ah = t - 0.5
            p_ah = dt_ah / 0.45
            warm_air = (random.random() * 2 - 1) * math.sin(math.pi * p_ah) * 0.18
            val += warm_air
        samples.append(val)
    return samples

# 7. Ronroneo tierno amígdala + clic lámpara + acorde piano cálido final
def synth_amigdala_ronroneo_clic_lampara(duration=1.1):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Ronroneo dulce hmmm de la amígdala (0.0 a 0.5s)
        if t < 0.5:
            p_purr = t / 0.5
            freq_p = 220 + 30 * math.sin(2 * math.pi * 14 * t)
            purr = math.sin(2 * math.pi * freq_p * t) * math.sin(math.pi * p_purr) * 0.35
            val += purr
        # Clic de interruptor de lámpara eléctrica (0.52 a 0.62s)
        if 0.52 <= t < 0.62:
            dt_c = t - 0.52
            click = math.sin(2 * math.pi * 1900 * dt_c) * math.exp(-90 * dt_c) * 0.8
            val += click
        # Acorde cálido de piano final desvaneciéndose en paz (0.58 a 1.1s)
        if t >= 0.58:
            dt_pi = t - 0.58
            p_pi = dt_pi / 0.52
            chord = (
                math.sin(2 * math.pi * 261.63 * dt_pi) * 0.5 +   # C4
                math.sin(2 * math.pi * 329.63 * dt_pi) * 0.4 +   # E4
                math.sin(2 * math.pi * 392.00 * dt_pi) * 0.35 +  # G4
                math.sin(2 * math.pi * 523.25 * dt_pi) * 0.25    # C5
            )
            env_pi = math.exp(-4 * p_pi) * 0.7
            val += chord * env_pi
        samples.append(val)
    return samples

def main():
    sfx_list = [
        ("sfx_suspiro_proyector_cine_risas.wav", synth_suspiro_proyector_cine_risas, 1.05),
        ("sfx_quejido_bostezo_guardia_ronquido.wav", synth_quejido_bostezo_guardia_ronquido, 1.1),
        ("sfx_alarma_submarino_palanca_panico.wav", synth_alarma_submarino_palanca_panico, 1.05),
        ("sfx_engranajes_oxidados_chispas_ansiedad.wav", synth_engranajes_oxidados_chispas_ansiedad, 1.1),
        ("sfx_viento_cueva_ramas_grunido_tigre.wav", synth_viento_cueva_ramas_gruñido_tigre, 1.15),
        ("sfx_disolucion_humo_alivio_facturas.wav", synth_disolucion_humo_alivio_facturas, 1.0),
        ("sfx_amigdala_ronroneo_clic_lampara.wav", synth_amigdala_ronroneo_clic_lampara, 1.1),
    ]
    for filename, fn, dur in sfx_list:
        path = os.path.join("public", "sfx", filename)
        samples = fn(dur)
        guardar_wav(path, samples)

if __name__ == "__main__":
    main()
