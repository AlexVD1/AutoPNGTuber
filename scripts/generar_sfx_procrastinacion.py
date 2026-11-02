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

# 1. sfx_procrastina_iman_scroll.wav (~2.5s)
# Clock ticking + magnetic buzz ('zzzzzt') + notification pop + rapid phone scroll whooshes
t1 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
s1 = np.zeros_like(t1)
# Clock ticks at 0.1s, 0.5s, 0.9s
for tick_t in [0.1, 0.5, 0.9]:
    tt = np.maximum(0, t1 - tick_t)
    tick = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 80) * (t1 >= tick_t)
    s1 += tick * 0.4
# Magnetic pull buzz from 0.8s to 1.4s
t_mag = np.maximum(0, t1 - 0.8)
mag_env = np.sin(np.pi * np.clip(t_mag / 0.6, 0, 1)) ** 1.5 * (t1 >= 0.8) * (t1 < 1.4)
buzz = (np.sin(2 * np.pi * 120 * t_mag) + 0.4 * np.sin(2 * np.pi * 240 * t_mag) + 0.3 * np.random.normal(0, 0.2, len(t1))) * mag_env
s1 += buzz * 0.65
# Notification pop at 1.35s
t_pop = np.maximum(0, t1 - 1.35)
pop = np.sin(2 * np.pi * (880 + 1200 * t_pop) * t_pop) * np.exp(-t_pop * 45) * (t1 >= 1.35)
s1 += pop * 0.7
# Rapid scroll whooshes at 1.7s, 2.0s, 2.3s
for swish_t in [1.7, 2.0, 2.3]:
    tsw = np.maximum(0, t1 - swish_t)
    swish = np.random.normal(0, 0.25, len(t1)) * np.sin(np.pi * np.clip(tsw / 0.15, 0, 1)) ** 2 * (t1 >= swish_t) * (t1 < swish_t + 0.15)
    s1 += swish * 0.5
save_wav("sfx_procrastina_iman_scroll.wav", s1)

# 2. sfx_ring_boxeo_campana_fanfarria.wav (~2.6s)
# Dual metallic boxing bell ('DING-DING') + crowd cheer swell + brassy fight fanfare
t2 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s2 = np.zeros_like(t2)
# Bell 1 at 0.1s, Bell 2 at 0.5s (880 Hz + 1760 Hz with metallic resonance)
for b_t in [0.1, 0.5]:
    tb = np.maximum(0, t2 - b_t)
    bell = (np.sin(2 * np.pi * 1046.5 * tb) + 0.5 * np.sin(2 * np.pi * 2093.0 * tb) + 0.25 * np.sin(2 * np.pi * 3135.9 * tb)) * np.exp(-tb * 7) * (t2 >= b_t)
    s2 += bell * 0.75
# Distant crowd cheer swell from 0.4s to 2.5s
tc = np.maximum(0, t2 - 0.4)
cheer_env = np.sin(np.pi * np.clip(tc / 2.1, 0, 1)) ** 1.3 * (t2 >= 0.4)
crowd = np.random.normal(0, 0.25, len(t2)) * cheer_env
# Stadium brass fanfare (Triad: C4, E4, G4 -> C5)
for f_start, f_hz in [(0.8, 261.63), (1.1, 329.63), (1.4, 392.0), (1.7, 523.25)]:
    tf = np.maximum(0, t2 - f_start)
    fanfare = (np.sin(2 * np.pi * f_hz * tf) + 0.4 * np.sin(2 * np.pi * f_hz * 2 * tf) + 0.2 * np.sin(2 * np.pi * f_hz * 3 * tf)) * np.exp(-tf * 4) * (t2 >= f_start)
    s2 += fanfare * 0.35
s2 += crowd * 0.4
save_wav("sfx_ring_boxeo_campana_fanfarria.wav", s2)

# 3. sfx_pizarron_calculando_whir.wav (~2.4s)
# Marker squeaks on whiteboard + slow computer disk processing whirr + analytical ping
t3 = np.linspace(0, 2.4, int(SR * 2.4), endpoint=False)
s3 = np.zeros_like(t3)
# Squeaks at 0.2s, 0.6s, 1.0s
for sq_t in [0.2, 0.6, 1.0]:
    ts = np.maximum(0, t3 - sq_t)
    squeak = np.sin(2 * np.pi * (2400 + 800 * np.sin(ts * 80)) * ts) * np.exp(-ts * 30) * (t3 >= sq_t) * (t3 < sq_t + 0.12)
    s3 += squeak * 0.45
# Computer disk whirr from 0.8s to 2.2s
tw = np.maximum(0, t3 - 0.8)
whir_env = np.sin(np.pi * np.clip(tw / 1.4, 0, 1)) ** 1.2 * (t3 >= 0.8) * (t3 < 2.2)
whir = (np.sin(2 * np.pi * (80 + 20 * np.sin(tw * 15)) * tw) * 0.4 + 0.25 * np.random.normal(0, 0.2, len(t3))) * whir_env
s3 += whir * 0.6
# Analytical chime at 1.8s
tch = np.maximum(0, t3 - 1.8)
chime = (np.sin(2 * np.pi * 1318.5 * tch) + 0.4 * np.sin(2 * np.pi * 2637.0 * tch)) * np.exp(-tch * 9) * (t3 >= 1.8)
s3 += chime * 0.5
save_wav("sfx_pizarron_calculando_whir.wav", s3)

# 4. sfx_mazo_dopamina_arcade.wav (~2.6s)
# Heavy wooden club smash ('CRASH') + party confetti pop + retro arcade videogame powerup
t4 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
# Wood smash impact at 0.15s
t_imp = np.maximum(0, t4 - 0.15)
smash_low = np.sin(2 * np.pi * 65 * np.exp(-t_imp * 3) * t_imp) * np.exp(-t_imp * 12) * (t4 >= 0.15)
smash_crack = np.random.normal(0, 0.5, len(t4)) * np.exp(-t_imp * 25) * (t4 >= 0.15)
s4 = smash_low * 0.8 + smash_crack * 0.5
# Confetti pops at 0.7s, 0.9s
for cp_t in [0.7, 0.9]:
    tcp = np.maximum(0, t4 - cp_t)
    cpop = np.sin(2 * np.pi * 950 * tcp) * np.exp(-tcp * 50) * (t4 >= cp_t)
    s4 += cpop * 0.5
# Retro 8-bit arcade arpeggio from 1.1s to 2.4s (happy dopamine level-up)
notes = [(1.1, 440), (1.25, 554.37), (1.4, 659.25), (1.55, 880), (1.75, 1108.73)]
for n_t, n_hz in notes:
    tn = np.maximum(0, t4 - n_t)
    # 8-bit square wave approximation
    square = np.sign(np.sin(2 * np.pi * n_hz * tn)) * 0.25 * np.exp(-tn * 10) * (t4 >= n_t)
    s4 += square * 0.4
save_wav("sfx_mazo_dopamina_arcade.wav", s4)

# 5. sfx_fmri_escaneo_carpetas_thud.wav (~2.5s)
# Medical resonance scanner hum/beep + heavy paper folders thud ('OOF-SPLAT') + ironic chime
t5 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
# fMRI magnetic scanner gradient pulses from 0.1s to 1.3s
t_scan = np.maximum(0, t5 - 0.1)
scan_env = np.sin(np.pi * np.clip(t_scan / 1.2, 0, 1)) ** 1.5 * (t5 >= 0.1) * (t5 < 1.3)
scanner = (np.sin(2 * np.pi * 320 * t_scan) + 0.5 * np.sin(2 * np.pi * 640 * t_scan)) * (np.sin(t_scan * 35) > 0) * scan_env * 0.4
s5 = scanner
# Heavy folders impact at 1.4s ('THUD / SPLAT')
t_thud = np.maximum(0, t5 - 1.4)
thud_sub = np.sin(2 * np.pi * 70 * t_thud) * np.exp(-t_thud * 16) * (t5 >= 1.4)
paper_rustle = np.random.normal(0, 0.45, len(t5)) * np.exp(-t_thud * 22) * (t5 >= 1.4)
s5 += thud_sub * 0.75 + paper_rustle * 0.6
# Ironic comedic bell at 1.9s
tb = np.maximum(0, t5 - 1.9)
ironic_bell = np.sin(2 * np.pi * 1046.5 * tb) * np.exp(-tb * 8) * (t5 >= 1.9) * 0.4
s5 += ironic_bell
save_wav("sfx_fmri_escaneo_carpetas_thud.wav", s5)

# 6. sfx_sofa_vs_tormenta_panico.wav (~2.6s)
# Gentle relaxing popcorn crunch -> hysterical frantic keyboard typing + thunder crackle
t6 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s6 = np.zeros_like(t6)
# Popcorn crunch at 0.2s, 0.5s
for cr_t in [0.2, 0.5]:
    tcr = np.maximum(0, t6 - cr_t)
    crunch = np.random.normal(0, 0.35, len(t6)) * np.exp(-tcr * 40) * (t6 >= cr_t) * (t6 < cr_t + 0.1)
    s6 += crunch * 0.5
# Hysterical frantic typing from 0.8s to 2.4s ('clack-clack-clack')
for clk in np.arange(0.9, 2.4, 0.08):
    tclk = np.maximum(0, t6 - clk)
    click = np.sin(2 * np.pi * 3500 * tclk) * np.exp(-tclk * 90) * (t6 >= clk)
    s6 += click * 0.35
# Thunder crackle rumble at 1.5s
t_th = np.maximum(0, t6 - 1.5)
thunder = np.random.normal(0, 0.3, len(t6)) * np.sin(2 * np.pi * 45 * t_th) * np.exp(-t_th * 4) * (t6 >= 1.5)
s6 += thunder * 0.65
save_wav("sfx_sofa_vs_tormenta_panico.wav", s6)

# 7. sfx_candado_regla_5min_focus.wav (~2.8s)
# Heavy metallic padlock click ('CLIC-CLACK') + deep focused breath + smooth typing + warm acoustic guitar chord
t7 = np.linspace(0, 2.8, int(SR * 2.8), endpoint=False)
# Lock click at 0.15s, 0.25s
t_l1 = np.maximum(0, t7 - 0.15)
lock1 = (np.sin(2 * np.pi * 1800 * t_l1) + 0.5 * np.random.normal(0, 0.3, len(t7))) * np.exp(-t_l1 * 70) * (t7 >= 0.15)
t_l2 = np.maximum(0, t7 - 0.25)
lock2 = (np.sin(2 * np.pi * 1200 * t_l2) + 0.6 * np.random.normal(0, 0.35, len(t7))) * np.exp(-t_l2 * 50) * (t7 >= 0.25)
s7 = lock1 * 0.6 + lock2 * 0.8
# Calm breath/exhale at 0.5s
t_br = np.maximum(0, t7 - 0.5)
breath = np.random.normal(0, 0.15, len(t7)) * np.sin(np.pi * np.clip(t_br / 0.7, 0, 1)) ** 2 * (t7 >= 0.5) * (t7 < 1.2)
s7 += breath * 0.4
# Rhythmic keyboard strokes at 1.2s, 1.4s, 1.6s, 1.8s
for k_t in [1.2, 1.4, 1.6, 1.8]:
    tk = np.maximum(0, t7 - k_t)
    s7 += np.sin(2 * np.pi * 2800 * tk) * np.exp(-tk * 80) * (t7 >= k_t) * 0.3
# Warm motivational acoustic chord (A major 220, 277, 330, 440) from 1.5s
t_ac = np.maximum(0, t7 - 1.5)
chord_env = np.sin(np.pi * np.clip(t_ac / 1.3, 0, 1)) ** 0.8 * (t7 >= 1.5)
guitar = (np.sin(2 * np.pi * 220.0 * t_ac) * 0.4 +
          np.sin(2 * np.pi * 277.18 * t_ac) * 0.35 +
          np.sin(2 * np.pi * 329.63 * t_ac) * 0.35 +
          np.sin(2 * np.pi * 440.0 * t_ac) * 0.3) * chord_env
s7 += guitar * 0.65
save_wav("sfx_candado_regla_5min_focus.wav", s7)

print("All 7 Procrastination SFX generated successfully.")
