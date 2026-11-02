"""
Generador procedural de SFX para el video del Efecto Mandela.
Produce 8 archivos WAV de alta fidelidad (16-bit PCM, 44.1kHz).
"""

import math
import os
import random
import struct
import wave

SAMPLE_RATE = 44100

def write_wav(filename, samples):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        # Normalizar y prevenir clipping
        max_val = max((abs(s) for s in samples), default=1.0)
        scale = 0.95 / max_val if max_val > 0.95 else 1.0
        data = bytearray()
        for s in samples:
            val = max(-1.0, min(1.0, s * scale))
            int_val = int(val * 32767.0)
            data.extend(struct.pack('<h', int_val))
        wf.writeframes(data)
    print(f"[SFX OK] Creado: {filename} ({len(samples)/SAMPLE_RATE:.2f}s)")

def synth_sfx_1():
    # sfx_mandela_barrotes_poof.wav (1.0s)
    # Golpe seco de barrotes + desvanecimiento poof
    dur = 1.0
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # 0.0 - 0.4s: Golpe metálico de barrotes
    for i in range(int(SAMPLE_RATE * 0.45)):
        t = i / SAMPLE_RATE
        env = math.exp(-12 * t)
        metal = (
            0.4 * math.sin(2 * math.pi * 380 * t) +
            0.3 * math.sin(2 * math.pi * 790 * t) +
            0.2 * math.sin(2 * math.pi * 1250 * t) +
            0.15 * math.sin(2 * math.pi * 2100 * t)
        ) * env
        # Ruido de impacto inicial
        noise = (random.random() * 2 - 1) * math.exp(-40 * t) * 0.3
        samples[i] += metal + noise

    # 0.4 - 1.0s: Poof suave disolución
    start_poof = int(SAMPLE_RATE * 0.42)
    poof_len = n - start_poof
    lp = 0.0
    for j in range(poof_len):
        t_poof = j / SAMPLE_RATE
        env_poof = math.sin(math.pi * min(1.0, t_poof / 0.55)) * math.exp(-3.5 * t_poof)
        raw_noise = random.random() * 2 - 1
        # Filtro paso bajo simple
        cutoff = 0.15 * math.exp(-4 * t_poof) + 0.02
        lp += cutoff * (raw_noise - lp)
        samples[start_poof + j] += lp * env_poof * 0.7
    return samples

def synth_sfx_2():
    # sfx_timeline_clic_tv_estatica.wav (1.1s)
    # 3 clics + estática TV cortada con X
    dur = 1.1
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # Clics en 0.05, 0.25, 0.45
    clicks = [(0.05, 1800), (0.24, 2300), (0.43, 3100)]
    for c_time, freq in clicks:
        idx = int(c_time * SAMPLE_RATE)
        for i in range(int(0.04 * SAMPLE_RATE)):
            if idx + i < n:
                t = i / SAMPLE_RATE
                env = math.exp(-140 * t)
                samples[idx + i] += math.sin(2 * math.pi * freq * t) * env * 0.5
                samples[idx + i] += (random.random() * 2 - 1) * env * 0.2

    # Estática TV de 0.55 a 0.95
    idx_tv = int(0.55 * SAMPLE_RATE)
    len_tv = int(0.40 * SAMPLE_RATE)
    for i in range(len_tv):
        if idx_tv + i < n:
            t = i / SAMPLE_RATE
            noise = (random.random() * 2 - 1) * 0.35
            hum = math.sin(2 * math.pi * 60 * t) * 0.15
            fade_in = min(1.0, t / 0.05)
            samples[idx_tv + i] += (noise + hum) * fade_in

    # Corte abrupto con X en 0.95
    idx_x = int(0.95 * SAMPLE_RATE)
    for i in range(int(0.06 * SAMPLE_RATE)):
        if idx_x + i < n:
            t = i / SAMPLE_RATE
            env = math.exp(-60 * t)
            samples[idx_x + i] += (random.random() * 2 - 1) * env * 0.6 + math.sin(2 * math.pi * 120 * t) * env * 0.4
    return samples

def synth_sfx_3():
    # sfx_burbujas_pop_multitud.wav (1.0s)
    # Secuencia de pops de burbujas en expansión
    dur = 1.0
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    pops = [
        (0.05, 350, 750, 0.09),
        (0.22, 420, 880, 0.08),
        (0.38, 300, 700, 0.10),
        (0.52, 480, 990, 0.08),
        (0.68, 550, 1150, 0.07),
    ]
    for start_t, f0, f1, p_dur in pops:
        idx = int(start_t * SAMPLE_RATE)
        p_len = int(p_dur * SAMPLE_RATE)
        for i in range(p_len):
            if idx + i < n:
                t = i / SAMPLE_RATE
                prog = t / p_dur
                freq = f0 + (f1 - f0) * math.pow(prog, 0.7)
                env = math.sin(math.pi * prog) * math.exp(-3 * prog)
                samples[idx + i] += math.sin(2 * math.pi * freq * t) * env * 0.65
    return samples

def synth_sfx_4():
    # sfx_pincel_goma_sorpresa.wav (1.1s)
    # Pinceladas + goma de borrar + sorpresa
    dur = 1.1
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # Pincel (0.0 a 0.35s): fricción suave
    lp = 0.0
    for i in range(int(0.35 * SAMPLE_RATE)):
        t = i / SAMPLE_RATE
        raw = random.random() * 2 - 1
        lp += 0.05 * (raw - lp)
        env = (0.5 + 0.5 * math.sin(2 * math.pi * 4 * t)) * (1 - t / 0.35)
        samples[i] += lp * env * 0.6

    # Goma chillona (0.38 a 0.68s): chirrido de goma
    idx_g = int(0.38 * SAMPLE_RATE)
    for i in range(int(0.30 * SAMPLE_RATE)):
        if idx_g + i < n:
            t = i / SAMPLE_RATE
            wobble = math.sin(2 * math.pi * 35 * t)
            freq = 1900 + 400 * wobble
            env = math.sin(math.pi * (t / 0.30)) * 0.3
            samples[idx_g + i] += math.sin(2 * math.pi * freq * t) * env

    # Sting de sorpresa cómica (0.70 a 1.05s)
    idx_s = int(0.70 * SAMPLE_RATE)
    for i in range(int(0.38 * SAMPLE_RATE)):
        if idx_s + i < n:
            t = i / SAMPLE_RATE
            env = math.exp(-7 * t)
            # Acorde sorpresa
            chord = (
                0.35 * math.sin(2 * math.pi * 440 * t) +
                0.30 * math.sin(2 * math.pi * 554.37 * t) +
                0.25 * math.sin(2 * math.pi * 659.25 * t)
            ) * env
            samples[idx_s + i] += chord
    return samples

def synth_sfx_5():
    # sfx_choque_suave_vs_fuerte_vidrios.wav (1.2s)
    # Toque leve (0.0-0.4s) vs choque violento + cristales rotos (0.45-1.2s)
    dur = 1.2
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # Toque leve
    for i in range(int(0.30 * SAMPLE_RATE)):
        t = i / SAMPLE_RATE
        env = math.exp(-22 * t)
        bump = math.sin(2 * math.pi * 85 * t) * env * 0.5
        click = (random.random() * 2 - 1) * math.exp(-80 * t) * 0.2
        samples[i] += bump + click

    # Choque fuerte en 0.45
    idx_c = int(0.45 * SAMPLE_RATE)
    len_c = n - idx_c
    for i in range(len_c):
        t = i / SAMPLE_RATE
        env_boom = math.exp(-9 * t)
        boom = (
            0.5 * math.sin(2 * math.pi * 55 * t) +
            0.3 * math.sin(2 * math.pi * 110 * t) +
            (random.random() * 2 - 1) * math.exp(-15 * t) * 0.5
        ) * env_boom
        # Cristales tintineantes (dispersos)
        glass = 0.0
        if 0.05 < t < 0.65:
            tg = t - 0.05
            glass = (
                0.15 * math.sin(2 * math.pi * 2800 * tg) * math.exp(-8 * (tg % 0.12)) +
                0.12 * math.sin(2 * math.pi * 3600 * tg) * math.exp(-10 * ((tg + 0.04) % 0.14)) +
                0.10 * math.sin(2 * math.pi * 4800 * tg) * math.exp(-12 * ((tg + 0.08) % 0.10))
            ) * math.exp(-3 * tg)
        samples[idx_c + i] += boom + glass
    return samples

def synth_sfx_6():
    # sfx_vhs_crujido_rompecabezas_cajon.wav (1.1s)
    # Cinta VHS rompiéndose + pieza de madera + golpe de cajón
    dur = 1.1
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # Rotura cinta VHS (0.0 - 0.35s)
    for i in range(int(0.35 * SAMPLE_RATE)):
        t = i / SAMPLE_RATE
        env = math.exp(-8 * t)
        noise = (random.random() * 2 - 1) * (0.4 if random.random() > 0.85 else 0.08)
        crunch = math.sin(2 * math.pi * 220 * t) * noise * 2.0
        samples[i] += crunch * env

    # Encaje pieza madera (0.42 - 0.65s)
    idx_p = int(0.42 * SAMPLE_RATE)
    for i in range(int(0.20 * SAMPLE_RATE)):
        if idx_p + i < n:
            t = i / SAMPLE_RATE
            env = math.exp(-35 * t)
            wood = math.sin(2 * math.pi * 620 * t) * env * 0.7 + (random.random() * 2 - 1) * env * 0.2
            samples[idx_p + i] += wood

    # Golpe seco de cajón (0.72 - 1.1s)
    idx_d = int(0.72 * SAMPLE_RATE)
    for i in range(int(0.35 * SAMPLE_RATE)):
        if idx_d + i < n:
            t = i / SAMPLE_RATE
            env = math.exp(-14 * t)
            thud = math.sin(2 * math.pi * 75 * t) * env * 0.8 + (random.random() * 2 - 1) * math.exp(-50 * t) * 0.3
            samples[idx_d + i] += thud
    return samples

def synth_sfx_7():
    # sfx_multitud_murmullo_corte_x.wav (1.1s)
    # Murmullo creciente de multitud + corte seco con golpe X
    dur = 1.1
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # Murmullo (0.0 - 0.75s)
    idx_cut = int(0.75 * SAMPLE_RATE)
    for i in range(idx_cut):
        t = i / SAMPLE_RATE
        vol = (t / 0.75) * 0.65
        # Simulación de murmullo con oscilaciones de formantes
        v1 = math.sin(2 * math.pi * 220 * t) * math.sin(2 * math.pi * 3.5 * t)
        v2 = math.sin(2 * math.pi * 340 * t) * math.sin(2 * math.pi * 5.2 * t)
        v3 = math.sin(2 * math.pi * 480 * t) * math.sin(2 * math.pi * 2.1 * t)
        noise = (random.random() * 2 - 1) * 0.2
        samples[i] += (v1 + v2 + v3 + noise) * vol * 0.35

    # Golpe seco de sello/X en 0.75
    for i in range(int(0.25 * SAMPLE_RATE)):
        if idx_cut + i < n:
            t = i / SAMPLE_RATE
            env = math.exp(-25 * t)
            stamp = (
                0.6 * math.sin(2 * math.pi * 130 * t) +
                0.3 * (random.random() * 2 - 1)
            ) * env
            samples[idx_cut + i] += stamp
    return samples

def synth_sfx_8():
    # sfx_reloj_silencio_suspenso.wav (2.5s)
    # Acorde misterioso interrogativo + suave tic-tac de reloj + silencio flotante en el aire
    dur = 2.5
    n = int(SAMPLE_RATE * dur)
    samples = [0.0] * n
    # Acorde de intriga/pregunta en 0.0s (vibrafono sutil)
    for i in range(int(0.9 * SAMPLE_RATE)):
        t = i / SAMPLE_RATE
        env = math.exp(-4.5 * t)
        vibe = (
            0.4 * math.sin(2 * math.pi * 587.33 * t) +  # D5
            0.3 * math.sin(2 * math.pi * 880.00 * t) +  # A5
            0.2 * math.sin(2 * math.pi * 1174.66 * t)   # D6
        ) * env
        samples[i] += vibe * 0.5

    # Tics de reloj espaciados: 0.5s y 1.2s
    for tick_time in [0.55, 1.25]:
        idx = int(tick_time * SAMPLE_RATE)
        for j in range(int(0.04 * SAMPLE_RATE)):
            if idx + j < n:
                t = j / SAMPLE_RATE
                env = math.exp(-120 * t)
                tick = (math.sin(2 * math.pi * 2400 * t) + (random.random() * 2 - 1) * 0.3) * env * 0.4
                samples[idx + j] += tick

    # A partir de 1.4s en adelante: silencio puro en el aire
    return samples

if __name__ == "__main__":
    out_dir = os.path.join("public", "sfx")
    write_wav(os.path.join(out_dir, "sfx_mandela_barrotes_poof.wav"), synth_sfx_1())
    write_wav(os.path.join(out_dir, "sfx_timeline_clic_tv_estatica.wav"), synth_sfx_2())
    write_wav(os.path.join(out_dir, "sfx_burbujas_pop_multitud.wav"), synth_sfx_3())
    write_wav(os.path.join(out_dir, "sfx_pincel_goma_sorpresa.wav"), synth_sfx_4())
    write_wav(os.path.join(out_dir, "sfx_choque_suave_vs_fuerte_vidrios.wav"), synth_sfx_5())
    write_wav(os.path.join(out_dir, "sfx_vhs_crujido_rompecabezas_cajon.wav"), synth_sfx_6())
    write_wav(os.path.join(out_dir, "sfx_multitud_murmullo_corte_x.wav"), synth_sfx_7())
    write_wav(os.path.join(out_dir, "sfx_reloj_silencio_suspenso.wav"), synth_sfx_8())
    print("[SFX COMPLETO] Todos los 8 efectos sonoros sintetizados.")
