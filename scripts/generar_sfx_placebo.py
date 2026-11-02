import math
import numpy as np
import wave
from pathlib import Path

SR = 44100
SFX_DIR = Path("public/sfx")
SFX_DIR.mkdir(parents=True, exist_ok=True)

def save_wav(name: str, samples: np.ndarray):
    samples = np.clip(samples, -0.98, 0.98)
    data = (samples * 32767).astype(np.int16)
    with wave.open(str(SFX_DIR / name), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(data.tobytes())
    print(f"Generated: {name} ({len(samples)/SR:.2f}s)")

# 1. sfx_placebo_dolor_alivio_shimmer.wav (~2.6s)
# Headache heartbeat throb ("thump-thump") + water gulp + celestial blue relief shimmer ("shiiin")
t1 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s1 = np.zeros_like(t1)
# Throbs at 0.1s and 0.5s
for throb_t in [0.1, 0.5]:
    tt = np.maximum(0, t1 - throb_t)
    throb = np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 12) * (t1 >= throb_t)
    s1 += throb * 0.7
# Water gulp at 1.1s (frequency modulated downward bubble)
tg = np.maximum(0, t1 - 1.1)
gulp = np.sin(2 * np.pi * (320 - 140 * np.clip(tg / 0.18, 0, 1)) * tg) * np.sin(np.pi * np.clip(tg / 0.18, 0, 1)) ** 2 * (t1 >= 1.1) * (t1 < 1.35)
s1 += gulp * 0.65
# Celestial relief shimmer from 1.5s to 2.5s (Chords: E5, G#5, B5, E6 + sparkle noise)
tsh = np.maximum(0, t1 - 1.5)
shimmer_env = np.sin(np.pi * np.clip(tsh / 1.0, 0, 1)) ** 1.3 * (t1 >= 1.5)
for f_hz in [659.25, 830.61, 987.77, 1318.51]:
    s1 += (np.sin(2 * np.pi * f_hz * tsh) + 0.3 * np.sin(2 * np.pi * f_hz * 2 * tsh)) * np.exp(-tsh * 2.5) * shimmer_env * 0.22
# Micro sparkle high frequencies
s1 += np.random.normal(0, 0.1, len(t1)) * np.sin(2 * np.pi * 3200 * t1) * shimmer_env * 0.15
save_wav("sfx_placebo_dolor_alivio_shimmer.wav", s1)

# 2. sfx_placebo_record_scratch_azucar.wav (~2.5s)
# Disc brake record scratch + comical "boing" spring + puzzled question mark tone
t2 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
s2 = np.zeros_like(t2)
# Record scratch at 0.15s
tsc = np.maximum(0, t2 - 0.15)
scratch_env = np.sin(np.pi * np.clip(tsc / 0.35, 0, 1)) ** 2 * (t2 >= 0.15) * (t2 < 0.55)
scratch = (np.sin(2 * np.pi * (400 - 300 * (tsc / 0.35)) * tsc) + np.random.normal(0, 0.4, len(t2))) * scratch_env
s2 += scratch * 0.75
# Comical Boing spring at 0.7s (modulated frequency oscillating like a cartoon spring)
tb = np.maximum(0, t2 - 0.7)
boing_freq = 320 + 260 * np.sin(2 * np.pi * 14 * tb) * np.exp(-tb * 4)
boing = np.sin(2 * np.pi * boing_freq * tb) * np.exp(-tb * 5) * (t2 >= 0.7)
s2 += boing * 0.7
# Question mark puzzled pizzicato at 1.5s
tp = np.maximum(0, t2 - 1.5)
pizzi = (np.sin(2 * np.pi * 440 * tp) * (tp < 0.15) + np.sin(2 * np.pi * 587.33 * np.maximum(0, tp - 0.2)) * (tp >= 0.2)) * np.exp(-tp * 8) * (t2 >= 1.5)
s2 += pizzi * 0.5
save_wav("sfx_placebo_record_scratch_azucar.wav", s2)

# 3. sfx_placebo_red_nerviosa_fibra_optica.wav (~2.6s)
# Bioelectric pulses + high speed fiber optic ascending light whoosh
t3 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s3 = np.zeros_like(t3)
# Electric pulses at 0.15s, 0.4s, 0.7s
for zap_t in [0.15, 0.4, 0.7]:
    tz = np.maximum(0, t3 - zap_t)
    zap = (np.sin(2 * np.pi * (1800 + 600 * np.sin(tz * 60)) * tz) + np.random.normal(0, 0.25, len(t3))) * np.exp(-tz * 40) * (t3 >= zap_t) * (t3 < zap_t + 0.1)
    s3 += zap * 0.5
# Ascending fiber optic laser hum whoosh from 0.8s to 2.4s
tw = np.maximum(0, t3 - 0.8)
wh_env = np.sin(np.pi * np.clip(tw / 1.6, 0, 1)) ** 1.5 * (t3 >= 0.8)
sweep_f = 120 * np.exp(tw * 1.8) # from 120 Hz to ~2100 Hz
whoosh = (np.sin(2 * np.pi * sweep_f * tw) + 0.3 * np.sin(2 * np.pi * sweep_f * 2 * tw) + 0.2 * np.random.normal(0, 0.2, len(t3))) * wh_env
s3 += whoosh * 0.7
save_wav("sfx_placebo_red_nerviosa_fibra_optica.wav", s3)

# 4. sfx_placebo_farmacia_candados_endorfinas.wav (~2.7s)
# Pneumatic steam release ("fshhhh") + dual padlock clicks ("click-clack") + golden chord
t4 = np.linspace(0, 2.7, int(SR * 2.7), endpoint=False)
s4 = np.zeros_like(t4)
# Steam hiss at 0.1s to 0.7s
ts = np.maximum(0, t4 - 0.1)
hiss_env = np.sin(np.pi * np.clip(ts / 0.6, 0, 1)) ** 1.8 * (t4 >= 0.1) * (t4 < 0.75)
hiss = np.random.normal(0, 0.35, len(t4)) * hiss_env
s4 += hiss * 0.6
# Dual metallic padlock snap at 0.9s and 1.35s
for click_t, pitch in [(0.9, 1200), (1.35, 1450)]:
    tc = np.maximum(0, t4 - click_t)
    click = (np.sin(2 * np.pi * pitch * tc) + 0.5 * np.sin(2 * np.pi * pitch * 2.5 * tc)) * np.exp(-tc * 65) * (t4 >= click_t)
    s4 += click * 0.75
# Golden warm major chord bloom from 1.6s to 2.6s (D major: D4, F#4, A4, D5)
tg = np.maximum(0, t4 - 1.6)
gold_env = np.sin(np.pi * np.clip(tg / 1.0, 0, 1)) ** 1.2 * (t4 >= 1.6)
for hz in [293.66, 369.99, 440.0, 587.33]:
    s4 += (np.sin(2 * np.pi * hz * tg) + 0.25 * np.sin(2 * np.pi * hz * 2 * tg)) * np.exp(-tg * 2.2) * gold_env * 0.25
save_wav("sfx_placebo_farmacia_candados_endorfinas.wav", s4)

# 5. sfx_placebo_monitor_cardiaco_dopamina.wav (~2.6s)
# Calm heartbeat lub-dub + stable monitor beep + turquoise sparkle chime
t5 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s5 = np.zeros_like(t5)
# Heartbeat at 0.2s (lub) and 0.45s (dub), then at 1.3s and 1.55s
for hb_t, vol in [(0.2, 0.7), (0.45, 0.5), (1.3, 0.7), (1.55, 0.5)]:
    th = np.maximum(0, t5 - hb_t)
    hb = np.sin(2 * np.pi * 60 * th) * np.exp(-th * 24) * (t5 >= hb_t)
    s5 += hb * vol
# Monitor beeps at 0.8s and 1.9s (pure 980 Hz sine)
for bp_t in [0.8, 1.9]:
    tb = np.maximum(0, t5 - bp_t)
    beep = np.sin(2 * np.pi * 987.77 * tb) * np.exp(-tb * 20) * (t5 >= bp_t) * (t5 < bp_t + 0.12)
    s5 += beep * 0.5
# Turquoise dopamine sparkle chime at 2.1s
td = np.maximum(0, t5 - 2.1)
dopamine_chime = (np.sin(2 * np.pi * 1760 * td) + 0.5 * np.sin(2 * np.pi * 2637 * td)) * np.exp(-td * 15) * (t5 >= 2.1)
s5 += dopamine_chime * 0.45
save_wav("sfx_placebo_monitor_cardiaco_dopamina.wav", s5)

# 6. sfx_placebo_powerup_etiqueta_abierta.wav (~2.6s)
# Light chuckle bounce + water gulp + electric power-up arpeggio
t6 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s6 = np.zeros_like(t6)
# Chuckle bounce at 0.15s and 0.35s
for ch_t in [0.15, 0.35]:
    tch = np.maximum(0, t6 - ch_t)
    chk = np.sin(2 * np.pi * 380 * tch) * np.exp(-tch * 30) * (t6 >= ch_t)
    s6 += chk * 0.4
# Gulp at 0.75s
tg6 = np.maximum(0, t6 - 0.75)
gulp6 = np.sin(2 * np.pi * (340 - 150 * np.clip(tg6 / 0.16, 0, 1)) * tg6) * np.sin(np.pi * np.clip(tg6 / 0.16, 0, 1)) ** 2 * (t6 >= 0.75) * (t6 < 0.95)
s6 += gulp6 * 0.6
# Power-up arpeggio from 1.1s (C5, E5, G5, C6, E6)
notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]
for i, note in enumerate(notes):
    tn = np.maximum(0, t6 - (1.1 + i * 0.12))
    note_snd = (np.sin(2 * np.pi * note * tn) + 0.3 * np.sin(2 * np.pi * note * 2 * tn)) * np.exp(-tn * 9) * (t6 >= 1.1 + i * 0.12)
    s6 += note_snd * 0.35
save_wav("sfx_placebo_powerup_etiqueta_abierta.wav", s6)

# 7. sfx_placebo_cierre_triunfal_farmacia_interna.wav (~2.8s)
# Confident steps ("tap-tap") + inspiring orchestral brass chords + final clean bell & iris whoosh
t7 = np.linspace(0, 2.8, int(SR * 2.8), endpoint=False)
s7 = np.zeros_like(t7)
# Footsteps at 0.15s, 0.5s, 0.85s
for step_t in [0.15, 0.5, 0.85]:
    tst = np.maximum(0, t7 - step_t)
    step = (np.sin(2 * np.pi * 140 * tst) + np.random.normal(0, 0.15, len(t7))) * np.exp(-tst * 35) * (t7 >= step_t) * (t7 < step_t + 0.1)
    s7 += step * 0.4
# Inspiring orchestral chords (F -> G -> C) from 1.0s to 2.6s
for chord_t, freqs in [(1.0, [349.23, 440.0, 523.25]), (1.5, [392.0, 493.88, 587.33]), (2.0, [523.25, 659.25, 783.99, 1046.5])]:
    tc = np.maximum(0, t7 - chord_t)
    chord_env = np.sin(np.pi * np.clip(tc / 0.7, 0, 1)) ** 1.3 * (t7 >= chord_t)
    for f in freqs:
        s7 += (np.sin(2 * np.pi * f * tc) + 0.3 * np.sin(2 * np.pi * f * 2 * tc)) * np.exp(-tc * 2.8) * chord_env * 0.2
# Final sparkling bell at 2.2s
tb7 = np.maximum(0, t7 - 2.2)
bell = (np.sin(2 * np.pi * 2093.0 * tb7) + 0.5 * np.sin(2 * np.pi * 4186.0 * tb7)) * np.exp(-tb7 * 8) * (t7 >= 2.2)
s7 += bell * 0.5
save_wav("sfx_placebo_cierre_triunfal_farmacia_interna.wav", s7)
print("All 7 placebo SFX generated successfully!")
