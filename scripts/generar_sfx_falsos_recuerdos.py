import math
import numpy as np
import wave
from pathlib import Path

OUTPUT_DIR = Path("public/sfx")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_RATE = 44100


def save_wav(filename: str, audio: np.ndarray):
    audio = np.clip(audio, -1.0, 1.0)
    audio_int16 = (audio * 32767).astype(np.int16)
    filepath = OUTPUT_DIR / filename
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio_int16.tobytes())
    print(f"Generated SFX: {filepath}")


# 1. sfx_choque_juguete_cristal.wav: Clack de juguete (0-0.2s), pausa breve, y crash de cristal rompiéndose (0.35s - 1.2s)
def gen_s1_choque_cristal():
    duration = 1.3
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Clack seco de plástico/juguete en t=0.05
    idx_clack = int(0.05 * SAMPLE_RATE)
    len_clack = int(0.12 * SAMPLE_RATE)
    tc = np.linspace(0, 0.12, len_clack, endpoint=False)
    clack = np.sin(2 * np.pi * 320 * tc) * np.exp(-tc * 45) * 0.7
    clack += np.random.normal(0, 0.3, len_clack) * np.exp(-tc * 60)
    audio[idx_clack:idx_clack+len_clack] += clack

    # Crash de cristal en t=0.38
    idx_glass = int(0.38 * SAMPLE_RATE)
    len_glass = int(0.85 * SAMPLE_RATE)
    tg = np.linspace(0, 0.85, len_glass, endpoint=False)
    # Tonos agudos resonantes de vidrio quebrado
    glass = (
        np.sin(2 * np.pi * 2800 * tg) * 0.35 +
        np.sin(2 * np.pi * 4200 * tg) * 0.30 +
        np.sin(2 * np.pi * 5600 * tg) * 0.25 +
        np.sin(2 * np.pi * 7100 * tg) * 0.20
    ) * np.exp(-tg * 8.5)
    # Ruido blanco brillante quebrado
    noise = np.random.normal(0, 0.5, len_glass) * np.exp(-tg * 12.0)
    # Shards dispersos
    for offset, freq in [(0.08, 3400), (0.16, 4800), (0.25, 2900), (0.35, 6200)]:
        i_off = int(offset * SAMPLE_RATE)
        t_shard = tg[i_off:]
        shard = np.sin(2 * np.pi * freq * t_shard) * np.exp(-t_shard * 18) * 0.25
        glass[i_off:] += shard

    audio[idx_glass:idx_glass+len_glass] += (glass + noise) * 0.8
    save_wav("sfx_choque_juguete_cristal.wav", audio)


# 2. sfx_caja_fuerte_vhs_glitch.wav: Clic caja fuerte (0.05), inserción clunk-whir (0.3-0.7), glitch VHS (0.8-1.5)
def gen_s2_caja_vhs():
    duration = 1.6
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Clic metálico de cerrojo
    idx1 = int(0.06 * SAMPLE_RATE)
    l1 = int(0.18 * SAMPLE_RATE)
    t1 = np.linspace(0, 0.18, l1, endpoint=False)
    click = (np.sin(2 * np.pi * 1200 * t1) + np.sin(2 * np.pi * 1850 * t1)) * np.exp(-t1 * 35) * 0.6
    audio[idx1:idx1+l1] += click

    # Inserción pesada de cassette VHS (clunk y zumbido de engranaje)
    idx2 = int(0.35 * SAMPLE_RATE)
    l2 = int(0.40 * SAMPLE_RATE)
    t2 = np.linspace(0, 0.40, l2, endpoint=False)
    motor = np.sin(2 * np.pi * (180 + t2 * 250) * t2) * 0.35 * (1 - np.exp(-t2 * 20)) * np.exp(-t2 * 6)
    clunk = np.sin(2 * np.pi * 95 * t2) * np.exp(-t2 * 25) * 0.65
    audio[idx2:idx2+l2] += (motor + clunk)

    # Glitch analógico VHS: zumbido 60Hz + estática modulada
    idx3 = int(0.85 * SAMPLE_RATE)
    l3 = int(0.70 * SAMPLE_RATE)
    t3 = np.linspace(0, 0.70, l3, endpoint=False)
    hum = (np.sin(2 * np.pi * 60 * t3) + 0.5 * np.sin(2 * np.pi * 120 * t3)) * 0.35
    static = np.random.normal(0, 0.4, l3) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t3)) * np.exp(-t3 * 3.5)
    audio[idx3:idx3+l3] += (hum + static) * 0.75
    save_wav("sfx_caja_fuerte_vhs_glitch.wav", audio)


# 3. sfx_goma_borrar_sello_reconsolidado.wav: Borrador scritch-scratch (0.1-0.5), soplido (0.6-0.8), golpe de sello THUMP (0.9-1.3)
def gen_s3_goma_sello():
    duration = 1.45
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Scritch-scratch de goma sobre papel (3 pasadas rápidas)
    for p in [0.08, 0.22, 0.36]:
        ip = int(p * SAMPLE_RATE)
        lp = int(0.11 * SAMPLE_RATE)
        tp = np.linspace(0, 0.11, lp, endpoint=False)
        scratch = np.random.normal(0, 0.35, lp) * np.sin(np.pi * tp / 0.11) * 0.5
        audio[ip:ip+lp] += scratch

    # Soplido fuff en t=0.58
    ib = int(0.55 * SAMPLE_RATE)
    lb = int(0.24 * SAMPLE_RATE)
    tb = np.linspace(0, 0.24, lb, endpoint=False)
    blow = np.random.normal(0, 0.25, lb) * np.sin(np.pi * tb / 0.24) * 0.45
    audio[ib:ib+lb] += blow

    # Golpe seco de sello THUMP en t=0.88
    ist = int(0.88 * SAMPLE_RATE)
    lst = int(0.50 * SAMPLE_RATE)
    tst = np.linspace(0, 0.50, lst, endpoint=False)
    thump = np.sin(2 * np.pi * 80 * np.exp(-tst * 12) * tst) * np.exp(-tst * 14) * 0.85
    impact_noise = np.random.normal(0, 0.3, lst) * np.exp(-tst * 40)
    audio[ist:ist+lst] += (thump + impact_noise)
    save_wav("sfx_goma_borrar_sello_reconsolidado.wav", audio)


# 4. sfx_tribunal_mazo_loftus.wav: Murmullo solemne, golpe de mazo judicial BANG (0.35s), tono interrogativo (0.75s)
def gen_s4_tribunal_mazo():
    duration = 1.4
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Murmullo reverbero sordo
    audio += np.sin(2 * np.pi * 55 * t) * 0.08 * (1 - np.exp(-t * 5))

    # Mazo de madera judicial BANG en t=0.28
    im = int(0.28 * SAMPLE_RATE)
    lm = int(0.45 * SAMPLE_RATE)
    tm = np.linspace(0, 0.45, lm, endpoint=False)
    wood = (np.sin(2 * np.pi * 140 * tm) * 0.7 + np.sin(2 * np.pi * 290 * tm) * 0.4) * np.exp(-tm * 16)
    wood_pop = np.random.normal(0, 0.5, lm) * np.exp(-tm * 50)
    audio[im:im+lm] += (wood + wood_pop) * 0.9

    # Tono interrogativo hmm/chime en t=0.75
    ic = int(0.75 * SAMPLE_RATE)
    lc = int(0.60 * SAMPLE_RATE)
    tc = np.linspace(0, 0.60, lc, endpoint=False)
    chime = (np.sin(2 * np.pi * 440 * tc) * 0.4 + np.sin(2 * np.pi * 660 * tc) * 0.3) * np.exp(-tc * 5)
    audio[ic:ic+lc] += chime * 0.6
    save_wav("sfx_tribunal_mazo_loftus.wav", audio)


# 5. sfx_loftus_velocimetro_kablam.wav: Aceleración motor (0-0.35), impacto KABLAM (0.38), vidrio triturado (0.55-1.2)
def gen_s5_velocimetro_kablam():
    duration = 1.45
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Aceleración pitch subiendo
    iacc = int(0.04 * SAMPLE_RATE)
    lacc = int(0.35 * SAMPLE_RATE)
    tacc = np.linspace(0, 0.35, lacc, endpoint=False)
    engine = np.sin(2 * np.pi * (80 + 320 * tacc) * tacc) * np.sin(np.pi * tacc / 0.35) * 0.55
    audio[iacc:iacc+lacc] += engine

    # Choque KABLAM en t=0.38
    ik = int(0.38 * SAMPLE_RATE)
    lk = int(0.60 * SAMPLE_RATE)
    tk = np.linspace(0, 0.60, lk, endpoint=False)
    sub_boom = np.sin(2 * np.pi * 65 * np.exp(-tk * 8) * tk) * np.exp(-tk * 10) * 0.9
    boom_noise = np.random.normal(0, 0.6, lk) * np.exp(-tk * 18)
    audio[ik:ik+lk] += (sub_boom + boom_noise) * 0.9

    # Vidrios triturados cayendo
    ig = int(0.50 * SAMPLE_RATE)
    lg = int(0.85 * SAMPLE_RATE)
    tg = np.linspace(0, 0.85, lg, endpoint=False)
    tinkle = (np.sin(2 * np.pi * 3200 * tg) * 0.25 + np.sin(2 * np.pi * 4900 * tg) * 0.2) * np.exp(-tg * 8)
    tinkle += np.random.normal(0, 0.35, lg) * np.exp(-tg * 12)
    audio[ig:ig+lg] += tinkle * 0.7
    save_wav("sfx_loftus_velocimetro_kablam.wav", audio)


# 6. sfx_rompecabezas_plastilina_snap.wav: Fricción madera (0.1), squish plastilina (0.3-0.6), chasquido snap perfecto (0.75-1.1)
def gen_s6_rompecabezas():
    duration = 1.3
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Squish plastilina (modulación suave de baja frecuencia)
    isq = int(0.18 * SAMPLE_RATE)
    lsq = int(0.35 * SAMPLE_RATE)
    tsq = np.linspace(0, 0.35, lsq, endpoint=False)
    squish = np.sin(2 * np.pi * 210 * (1 + 0.4 * np.sin(2 * np.pi * 24 * tsq)) * tsq) * np.sin(np.pi * tsq / 0.35) * 0.45
    squish += np.random.normal(0, 0.2, lsq) * np.sin(np.pi * tsq / 0.35) * 0.3
    audio[isq:isq+lsq] += squish

    # Pincel húmedo suave
    ip = int(0.48 * SAMPLE_RATE)
    lp = int(0.22 * SAMPLE_RATE)
    tp = np.linspace(0, 0.22, lp, endpoint=False)
    brush = np.random.normal(0, 0.22, lp) * np.sin(np.pi * tp / 0.22) * 0.4
    audio[ip:ip+lp] += brush

    # SNAP chasquido nítido en t=0.75
    isn = int(0.75 * SAMPLE_RATE)
    lsn = int(0.35 * SAMPLE_RATE)
    tsn = np.linspace(0, 0.35, lsn, endpoint=False)
    snap = np.sin(2 * np.pi * 1450 * tsn) * np.exp(-tsn * 45) * 0.7
    snap += np.sin(2 * np.pi * 2800 * tsn) * np.exp(-tsn * 55) * 0.4
    snap += np.random.normal(0, 0.35, lsn) * np.exp(-tsn * 60)
    audio[isn:isn+lsn] += snap * 0.85
    save_wav("sfx_rompecabezas_plastilina_snap.wav", audio)


# 7. sfx_album_fotos_pagina_piano.wav: Vuelta de hoja gruesa flick (0.1), cierre thud (0.5), acorde cálido de piano (0.7-1.7)
def gen_s7_album_piano():
    duration = 1.75
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    audio = np.zeros_like(t)

    # Vuelta de hoja flick en t=0.08
    iflick = int(0.08 * SAMPLE_RATE)
    lflick = int(0.22 * SAMPLE_RATE)
    tflick = np.linspace(0, 0.22, lflick, endpoint=False)
    page = np.random.normal(0, 0.3, lflick) * np.sin(np.pi * tflick / 0.22) * 0.45
    audio[iflick:iflick+lflick] += page

    # Cierre suave de libro THUD en t=0.45
    ithud = int(0.45 * SAMPLE_RATE)
    lthud = int(0.32 * SAMPLE_RATE)
    tthud = np.linspace(0, 0.32, lthud, endpoint=False)
    book_thud = np.sin(2 * np.pi * 110 * np.exp(-tthud * 10) * tthud) * np.exp(-tthud * 16) * 0.7
    audio[ithud:ithud+lthud] += book_thud

    # Acorde cálido de piano (C maj: 261.63, 329.63, 392.00, 523.25)
    ipiano = int(0.72 * SAMPLE_RATE)
    lpiano = int(1.00 * SAMPLE_RATE)
    tpiano = np.linspace(0, 1.00, lpiano, endpoint=False)
    notes = [261.63, 329.63, 392.00, 523.25]
    piano = np.zeros_like(tpiano)
    for i, freq in enumerate(notes):
        decay = 3.2 + i * 0.5
        harmonics = (
            np.sin(2 * np.pi * freq * tpiano) * 0.35 +
            np.sin(2 * np.pi * (freq * 2) * tpiano) * 0.15 +
            np.sin(2 * np.pi * (freq * 3) * tpiano) * 0.05
        ) * np.exp(-tpiano * decay)
        piano += harmonics
    audio[ipiano:ipiano+lpiano] += piano * 0.65
    save_wav("sfx_album_fotos_pagina_piano.wav", audio)


if __name__ == "__main__":
    gen_s1_choque_cristal()
    gen_s2_caja_vhs()
    gen_s3_goma_sello()
    gen_s4_tribunal_mazo()
    gen_s5_velocimetro_kablam()
    gen_s6_rompecabezas()
    gen_s7_album_piano()
    print("All SFX generated successfully!")
