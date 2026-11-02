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

# 1. Telégrafo morse + chispas arco eléctrico + fuego
def synth_telegrafo_morse_chispas(duration=1.0):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Clics morse (0 a 0.3s)
        if t < 0.3:
            clk_i = (int(t * 20)) % 3
            if (t * 20) % 1.0 < 0.4:
                freq = 1100 + clk_i * 80
                env = math.exp(-35 * ((t * 20) % 1.0))
                val += math.sin(2 * math.pi * freq * t) * env * 0.7
                val += (random.random() * 2 - 1) * env * 0.3
        # Arco eléctrico KZZZT (0.28 a 0.75s)
        if 0.28 <= t < 0.75:
            p_arc = (t - 0.28) / 0.47
            env_arc = math.sin(math.pi * p_arc) * (1.0 + 0.3 * math.sin(2 * math.pi * 35 * t))
            hum = math.sin(2 * math.pi * 120 * t) * 0.4
            saw = (math.sin(2 * math.pi * 240 * t) > 0) * 0.3
            noise = (random.random() * 2 - 1) * (0.8 if random.random() > 0.3 else 0.1)
            val += (hum + saw + noise) * env_arc * 0.95
        # Chisporroteo fuego (0.65 a 1.0s)
        if t >= 0.65:
            p_fire = (t - 0.65) / 0.35
            env_fire = (1.0 - p_fire) * 0.5
            if random.random() < 0.08:
                pop = (random.random() * 2 - 1) * math.exp(-60 * ((t * 60) % 1.0))
                val += pop * env_fire
        samples.append(val)
    return samples

# 2. Zumbido electromagnético aurora + atmósfera + gallo distante
def synth_zumbido_aurora_gallo(duration=1.0):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Zumbido electromagnético envolvente (whoosh-hummm)
        freq_hum = 90 + 30 * math.sin(2 * math.pi * 1.5 * t)
        hum = (math.sin(2 * math.pi * freq_hum * t) + 0.5 * math.sin(2 * math.pi * freq_hum * 2 * t)) * 0.5
        phase_shimmer = math.sin(2 * math.pi * 0.4 * t)
        env_hum = math.sin(math.pi * (t / duration))
        val += hum * env_hum * 0.7
        # Crujido atmosférico
        if random.random() < 0.03:
            val += (random.random() * 2 - 1) * 0.25 * env_hum
        # Gallo distante a deshoras (0.4s a 0.85s)
        if 0.4 <= t < 0.85:
            p_g = (t - 0.4) / 0.45
            freq_g = 600 + 400 * math.sin(math.pi * p_g)
            env_g = math.sin(math.pi * p_g) * math.exp(-p_g * 1.5)
            rooster = (math.sin(2 * math.pi * freq_g * t) + 0.3 * math.sin(2 * math.pi * freq_g * 2 * t))
            val += rooster * env_g * 0.45
        samples.append(val)
    return samples

# 3. Engranaje telescopio + destello blanco cegador + pluma
def synth_engranaje_telescopio_destello(duration=0.95):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Dos clics de rueda micrométrica (0.0 a 0.25s)
        if t < 0.25:
            for click_t in [0.05, 0.15]:
                dt = t - click_t
                if 0 <= dt < 0.03:
                    env_c = math.exp(-120 * dt)
                    val += math.sin(2 * math.pi * 2200 * dt) * env_c * 0.5
        # Destello lumínico incandescente flash-shiiin (0.28 a 0.8s)
        if 0.28 <= t < 0.85:
            dt_f = t - 0.28
            p_f = dt_f / 0.57
            freq_flash = 1800 + 1200 * math.exp(-3 * p_f)
            env_flash = math.sin(math.pi * math.pow(p_f, 0.6)) * math.exp(-1.8 * p_f)
            val += math.sin(2 * math.pi * freq_flash * dt_f) * env_flash * 0.85
            # Shimmer
            val += math.sin(2 * math.pi * (freq_flash * 1.5) * dt_f) * env_flash * 0.35
        # Rasgado de pluma (0.7 a 0.95s)
        if t >= 0.7:
            dt_p = t - 0.7
            scratch = (random.random() * 2 - 1) * math.sin(2 * math.pi * 40 * dt_p)
            val += scratch * (1.0 - (dt_p / 0.25)) * 0.25
        samples.append(val)
    return samples

# 4. Rugido cósmico de plasma + onda supersónica + impacto magnetosfera WHAM
def synth_impacto_plasma_magnetosfera(duration=1.1):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Rugido sordo cósmico ascendente (0 a 0.6s)
        if t < 0.65:
            p_roar = t / 0.65
            sub = math.sin(2 * math.pi * (40 + 50 * p_roar) * t) * math.pow(p_roar, 1.8)
            wind = (random.random() * 2 - 1) * math.pow(p_roar, 2.2) * 0.6
            val += (sub + wind) * 0.85
        # Impacto seco magnetosfera WHAM (0.65s a 1.1s)
        if t >= 0.65:
            dt_imp = t - 0.65
            p_imp = dt_imp / 0.45
            # Sub-bass heavy thump
            freq_thump = 95 * math.exp(-12 * p_imp) + 38
            thump = math.sin(2 * math.pi * freq_thump * dt_imp) * math.exp(-4 * p_imp)
            # Explosión magnética
            shatter = (random.random() * 2 - 1) * math.exp(-15 * p_imp) * 0.7
            # Resonancia metálica
            ring = math.sin(2 * math.pi * 480 * dt_imp) * math.exp(-8 * p_imp) * 0.35
            val += (thump * 1.1 + shatter + ring) * 0.95
        samples.append(val)
    return samples

# 5. Transición telegráfica a zumbido moderno de red y saturación
def synth_transicion_zumbido_red_moderna(duration=1.0):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        p = t / duration
        # Izquierda (antiguo): clics secos
        if t < 0.45:
            env_old = 1.0 - (t / 0.45)
            if (t * 15) % 1.0 < 0.3:
                clk = math.sin(2 * math.pi * 800 * t) * math.exp(-40 * ((t * 15) % 1.0))
                val += clk * env_old * 0.6
        # Derecha (moderno): zumbido 60Hz + armónicos + servidores
        if t >= 0.35:
            env_new = min(1.0, (t - 0.35) / 0.35)
            grid = (math.sin(2 * math.pi * 60 * t) * 0.6 +
                    math.sin(2 * math.pi * 120 * t) * 0.35 +
                    math.sin(2 * math.pi * 180 * t) * 0.2)
            # Frecuencia digital de satélites / datos
            data_chirp = math.sin(2 * math.pi * (1400 + 400 * math.sin(2 * math.pi * 20 * t)) * t) * 0.15
            fan = (random.random() * 2 - 1) * 0.12
            val += (grid + data_chirp + fan) * env_new * 0.85
        samples.append(val)
    return samples

# 6. Explosión transformador de alta tensión + caída de frecuencia blackout
def synth_explosion_transformador_blackout(duration=1.2):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Estallido eléctrico inicial BOOM-KZZZT (0 a 0.5s)
        if t < 0.5:
            p_boom = t / 0.5
            sub = math.sin(2 * math.pi * (120 * math.exp(-15 * p_boom) + 45) * t) * math.exp(-4 * p_boom)
            zap = ((random.random() * 2 - 1) + (1.0 if math.sin(2 * math.pi * 240 * t) > 0 else -1.0) * 0.5) * math.exp(-6 * p_boom)
            val += (sub * 1.1 + zap * 0.8) * 0.95
        # Apagón en descenso de tono (whirrr-down) (0.35s a 1.1s)
        if 0.35 <= t < 1.1:
            dt_down = t - 0.35
            p_down = dt_down / 0.75
            # Caída exponencial de 750 Hz a 50 Hz
            freq_down = 750 * math.pow(1 - p_down, 2.5) + 50
            env_down = math.pow(1 - p_down, 1.2) * 0.7
            hum_down = math.sin(2 * math.pi * freq_down * dt_down)
            val += hum_down * env_down * 0.75
        # Silencio repentino tras 1.05s
        if t >= 1.05:
            val *= math.exp(-30 * (t - 1.05))
        samples.append(val)
    return samples

# 7. Raspado de fósforo + encendido llama vela + soplido a negro
def synth_raspado_fosforo_vela_soplido(duration=1.05):
    samples = []
    n = int(SAMPLE_RATE * duration)
    for i in range(n):
        t = i / SAMPLE_RATE
        val = 0.0
        # Fricción fósforo shh-flick (0.0 a 0.22s)
        if t < 0.22:
            p_sh = t / 0.22
            friction = (random.random() * 2 - 1) * math.sin(math.pi * p_sh) * 0.6
            flick = math.sin(2 * math.pi * 1800 * t) * math.exp(-40 * (0.22 - t)) * 0.5
            val += friction + flick
        # Crepitar suave de llama (0.22 a 0.75s)
        if 0.22 <= t < 0.75:
            env_flame = 0.3
            if random.random() < 0.06:
                val += (random.random() * 2 - 1) * 0.25 * env_flame
            hum_air = math.sin(2 * math.pi * 110 * t) * 0.08
            val += hum_air
        # Soplido fuff (0.75 a 0.98s)
        if 0.75 <= t < 0.98:
            dt_puff = t - 0.75
            p_puff = dt_puff / 0.23
            puff = (random.random() * 2 - 1) * math.sin(math.pi * p_puff) * 0.8
            puff_sub = math.sin(2 * math.pi * 160 * dt_puff) * math.sin(math.pi * p_puff) * 0.3
            val += puff + puff_sub
        # Silencio absoluto al final (> 0.98s)
        if t >= 0.98:
            val = 0.0
        samples.append(val)
    return samples

def main():
    sfx_list = [
        ("sfx_telegrafo_morse_chispas.wav", synth_telegrafo_morse_chispas, 1.0),
        ("sfx_zumbido_aurora_gallo.wav", synth_zumbido_aurora_gallo, 1.0),
        ("sfx_engranaje_telescopio_destello.wav", synth_engranaje_telescopio_destello, 0.95),
        ("sfx_impacto_plasma_magnetosfera.wav", synth_impacto_plasma_magnetosfera, 1.1),
        ("sfx_transicion_zumbido_red_moderna.wav", synth_transicion_zumbido_red_moderna, 1.0),
        ("sfx_explosion_transformador_blackout.wav", synth_explosion_transformador_blackout, 1.2),
        ("sfx_raspado_fosforo_vela_soplido.wav", synth_raspado_fosforo_vela_soplido, 1.05),
    ]
    for filename, fn, dur in sfx_list:
        path = os.path.join("public", "sfx", filename)
        samples = fn(dur)
        guardar_wav(path, samples)

if __name__ == "__main__":
    main()
