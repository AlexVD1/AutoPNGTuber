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

# 1. sfx_mictlan_vela_flauta.wav (~2.5s)
# Match strike hiss + deep resonant warm pad + distant indigenous clay flute
t1 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
# Match strike at 0.1s
t_match = np.maximum(0, t1 - 0.08)
match_noise = np.random.normal(0, 0.35, len(t1)) * np.exp(-t_match * 25) * (t1 >= 0.08) * (t1 < 0.35)
# Deep warm resonant tone (130 Hz + 195 Hz)
drone = (np.sin(2 * np.pi * 130.81 * t1) * 0.4 + np.sin(2 * np.pi * 196.0 * t1) * 0.25) * np.sin(np.pi * np.clip(t1/2.5, 0, 1))**0.8
# Distant clay flute melody around 587 Hz (D5) -> 523 Hz (C5) -> 440 Hz (A4)
flute_t = np.maximum(0, t1 - 0.6)
flute_env = np.sin(np.pi * np.clip(flute_t / 1.8, 0, 1)) ** 1.2 * (t1 >= 0.6)
flute_freq = 587 - 120 * np.clip(flute_t / 1.8, 0, 1) + 8 * np.sin(2 * np.pi * 5.2 * flute_t) # with natural vibrato
flute = np.sin(2 * np.pi * flute_freq * flute_t) * flute_env * 0.35
# Add a touch of breath breathiness
flute_breath = np.random.normal(0, 0.08, len(t1)) * flute_env
s1 = match_noise * 0.7 + drone * 0.5 + (flute + flute_breath) * 0.6
save_wav("sfx_mictlan_vela_flauta.wav", s1)

# 2. sfx_cuatro_destinos_chime.wav (~2.6s)
# 4 distinct harmonic chimes ascending and spreading (representing the 4 paths)
t2 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s2 = np.zeros_like(t2)
# Chimes at 0.1s (Tonatiuh - high sun 880Hz), 0.6s (Tlalocan - water drop 659Hz), 1.1s (Tree - 523Hz), 1.6s (Mictlán - deep gong 220Hz)
destinos = [
    (0.1, 880, 0.7, 18),
    (0.6, 659.25, 0.6, 22),
    (1.1, 523.25, 0.6, 20),
    (1.6, 220.0, 0.8, 8)
]
for start_t, freq, amp, decay in destinos:
    td = np.maximum(0, t2 - start_t)
    wave_d = (np.sin(2 * np.pi * freq * td) + 0.3 * np.sin(2 * np.pi * freq * 2 * td)) * np.exp(-td * decay) * (t2 >= start_t)
    s2 += wave_d * amp
save_wav("sfx_cuatro_destinos_chime.wav", s2)

# 3. sfx_pasos_eco_ladrido.wav (~2.4s)
# Cavernous footsteps on stone + friendly soft xoloitzcuintle dog bark/whimper
t3 = np.linspace(0, 2.4, int(SR * 2.4), endpoint=False)
s3 = np.zeros_like(t3)
# Stone footsteps at 0.2s, 0.7s, 1.2s
for step_t in [0.2, 0.7, 1.2]:
    ts = np.maximum(0, t3 - step_t)
    step = (np.sin(2 * np.pi * 90 * ts) * 0.6 + np.random.normal(0, 0.25, len(t3))) * np.exp(-ts * 30) * (t3 >= step_t)
    # stone echo
    ts_echo = np.maximum(0, t3 - step_t - 0.08)
    echo = np.sin(2 * np.pi * 120 * ts_echo) * np.exp(-ts_echo * 20) * (t3 >= step_t + 0.08) * 0.3
    s3 += step * 0.5 + echo * 0.4
# Soft dog friendly double-woof / yip at 1.5s
tw = np.maximum(0, t3 - 1.5)
bark1 = np.sin(2 * np.pi * (380 - 120 * np.clip(tw/0.2, 0, 1)) * tw) * np.exp(-tw * 24) * (t3 >= 1.5) * (t3 < 1.75)
tw2 = np.maximum(0, t3 - 1.8)
bark2 = np.sin(2 * np.pi * (440 - 140 * np.clip(tw2/0.25, 0, 1)) * tw2) * np.exp(-tw2 * 20) * (t3 >= 1.8)
s3 += (bark1 * 0.5 + bark2 * 0.6)
save_wav("sfx_pasos_eco_ladrido.wav", s3)

# 4. sfx_montanas_choque_viento.wav (~2.6s)
# Massive stone mountains crashing (low boom) + icy obsidian wind whistle
t4 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
# Crash impact at 0.3s
t_imp = np.maximum(0, t4 - 0.3)
crash_sub = np.sin(2 * np.pi * 55 * np.exp(-t_imp * 2) * t_imp) * np.exp(-t_imp * 5) * (t4 >= 0.3)
crash_rubble = np.random.normal(0, 0.4, len(t4)) * np.exp(-t_imp * 12) * (t4 >= 0.3)
# Slicing whistling wind from 0.8s to 2.4s
twind = np.maximum(0, t4 - 0.7)
wind_env = np.sin(np.pi * np.clip(twind / 1.7, 0, 1)) ** 1.5 * (t4 >= 0.7)
wind_freq = 1400 + 600 * np.sin(twind * 6) + 300 * np.cos(twind * 14)
obsidian_wind = (np.sin(2 * np.pi * wind_freq * twind) + np.random.normal(0, 0.2, len(t4))) * wind_env
s4 = crash_sub * 0.8 + crash_rubble * 0.5 + obsidian_wind * 0.45
save_wav("sfx_montanas_choque_viento.wav", s4)

# 5. sfx_rio_apanohuayan_cruzar.wav (~2.5s)
# Water churning / swirling river + swim strokes + gentle native wooden flute
t5 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
water_noise = np.random.normal(0, 0.25, len(t5))
water_env = 0.3 + 0.2 * np.sin(t5 * 5) + 0.15 * np.sin(t5 * 11)
river = water_noise * water_env
# Splashing paddle strokes at 0.4s and 1.3s
for splash_t in [0.4, 1.3]:
    tsp = np.maximum(0, t5 - splash_t)
    splash = (np.sin(2 * np.pi * 320 * np.exp(-tsp * 15) * tsp) + np.random.normal(0, 0.3, len(t5))) * np.exp(-tsp * 18) * (t5 >= splash_t)
    river += splash * 0.6
# Warm reassurance flute motif
t_fl = np.maximum(0, t5 - 0.8)
fl_env = np.sin(np.pi * np.clip(t_fl / 1.5, 0, 1)) ** 1.3 * (t5 >= 0.8)
flute_mot = np.sin(2 * np.pi * (523 + 15 * np.sin(t_fl * 8)) * t_fl) * fl_env * 0.4
s5 = river * 0.7 + flute_mot * 0.5
save_wav("sfx_rio_apanohuayan_cruzar.wav", s5)

# 6. sfx_chignahumictlan_descanso.wav (~2.6s)
# Deep serene peace: warm ambient harmonic pad, quiet sigh of relief, sparkling dissolution
t6 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
pad = (np.sin(2 * np.pi * 174.61 * t6) * 0.4 +   # F3
       np.sin(2 * np.pi * 261.63 * t6) * 0.35 +  # C4
       np.sin(2 * np.pi * 329.63 * t6) * 0.25) * np.sin(np.pi * t6 / 2.6) ** 0.9
# Golden sparkles at 1.0s to 2.3s
t_sp = np.maximum(0, t6 - 0.9)
sparkles = np.zeros_like(t6)
for sp_t, sp_f in [(0.9, 1318), (1.2, 1567), (1.5, 1760), (1.8, 2093), (2.1, 2637)]:
    tsp = np.maximum(0, t6 - sp_t)
    sparkles += np.sin(2 * np.pi * sp_f * tsp) * np.exp(-tsp * 25) * (t6 >= sp_t) * 0.25
s6 = pad * 0.6 + sparkles * 0.5
save_wav("sfx_chignahumictlan_descanso.wav", s6)

# 7. sfx_codice_hojas_acorde.wav (~2.4s)
# Papyrus / amate paper turning rustle + gentle acoustic chord of understanding
t7 = np.linspace(0, 2.4, int(SR * 2.4), endpoint=False)
# Paper rustle at 0.15s - 0.6s
t_pap = np.maximum(0, t7 - 0.15)
paper = np.random.normal(0, 0.3, len(t7)) * np.sin(np.pi * np.clip(t_pap / 0.45, 0, 1)) ** 1.5 * (t7 >= 0.15) * (t7 < 0.6)
# Warm acoustic contemplation chord (G major 196, 246, 293, 392)
t_ch = np.maximum(0, t7 - 0.4)
chord_env = np.sin(np.pi * np.clip(t_ch / 1.9, 0, 1)) ** 0.8 * (t7 >= 0.4)
chord = (np.sin(2 * np.pi * 196.00 * t_ch) * 0.35 +
         np.sin(2 * np.pi * 246.94 * t_ch) * 0.3 +
         np.sin(2 * np.pi * 293.66 * t_ch) * 0.3 +
         np.sin(2 * np.pi * 392.00 * t_ch) * 0.25) * chord_env
s7 = paper * 0.5 + chord * 0.65
save_wav("sfx_codice_hojas_acorde.wav", s7)

# 8. sfx_ofrenda_cempasuchil_vela.wav (~2.8s)
# Warm copper chime + soft clay vessel sound + emotional peaceful glow
t8 = np.linspace(0, 2.8, int(SR * 2.8), endpoint=False)
# Copper bell at 0.1s
t_bell = np.maximum(0, t8 - 0.1)
bell = (np.sin(2 * np.pi * 659.25 * t_bell) + 0.4 * np.sin(2 * np.pi * 1318.5 * t_bell)) * np.exp(-t_bell * 8) * (t8 >= 0.1)
# Warm low tone (calm resonance)
warmth = np.sin(2 * np.pi * 146.83 * t8) * np.sin(np.pi * t8 / 2.8) ** 0.8 * 0.4
# Gentle breeze / breath of peace
breeze = np.random.normal(0, 0.12, len(t8)) * np.sin(np.pi * t8 / 2.8) ** 2
s8 = bell * 0.6 + warmth * 0.5 + breeze * 0.3
save_wav("sfx_ofrenda_cempasuchil_vela.wav", s8)

print("All 8 Mexica Mictlán SFX synthesized successfully.")
