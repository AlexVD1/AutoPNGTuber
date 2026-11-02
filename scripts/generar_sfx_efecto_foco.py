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

# 1. sfx_foco_tropiezo_spotlight.wav (~2.6s)
# Stumble whoosh + drip splash + heavy theater spotlight ignition ("CLACK-BUZZZ") + murmuring whisper
t1 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s1 = np.zeros_like(t1)
# Stumble whoosh at 0.1s
t_wh = np.maximum(0, t1 - 0.1)
whoosh = np.random.normal(0, 0.3, len(t1)) * np.sin(np.pi * np.clip(t_wh / 0.25, 0, 1)) ** 2 * (t1 >= 0.1) * (t1 < 0.35)
s1 += whoosh * 0.6
# Coffee drip at 0.4s (frequency drop bubble)
t_dr = np.maximum(0, t1 - 0.4)
drip = np.sin(2 * np.pi * (800 - 350 * np.clip(t_dr / 0.08, 0, 1)) * t_dr) * np.exp(-t_dr * 40) * (t1 >= 0.4)
s1 += drip * 0.7
# Heavy mechanical switch CLACK at 0.7s
t_sw = np.maximum(0, t1 - 0.7)
clack = (np.sin(2 * np.pi * 120 * t_sw) + np.sin(2 * np.pi * 950 * t_sw) + np.random.normal(0, 0.4, len(t1))) * np.exp(-t_sw * 60) * (t1 >= 0.7)
s1 += clack * 0.8
# Theatrical 60Hz transformer hum/buzz from 0.75s to 2.5s
t_bz = np.maximum(0, t1 - 0.75)
buzz_env = np.sin(np.pi * np.clip(t_bz / 1.75, 0, 1)) ** 1.2 * (t1 >= 0.75)
buzz = (np.sin(2 * np.pi * 60 * t_bz) + 0.5 * np.sin(2 * np.pi * 120 * t_bz) + 0.3 * np.sin(2 * np.pi * 180 * t_bz) + 0.15 * np.sin(2 * np.pi * 300 * t_bz)) * buzz_env
s1 += buzz * 0.45
# Whispering murmur noise
s1 += np.random.normal(0, 0.08, len(t1)) * np.sin(2 * np.pi * 450 * t1) * buzz_env * 0.25
save_wav("sfx_foco_tropiezo_spotlight.wav", s1)

# 2. sfx_foco_carreras_linterna_casco.wav (~2.5s)
# Cartoon running steps + shoe brake squeak + neon click + curious bell ping
t2 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
s2 = np.zeros_like(t2)
# Rapid cartoon footsteps at 0.1s, 0.25s, 0.4s, 0.55s, 0.7s
for step_t in [0.1, 0.25, 0.4, 0.55, 0.7]:
    ts = np.maximum(0, t2 - step_t)
    step = (np.sin(2 * np.pi * 320 * ts) + np.random.normal(0, 0.2, len(t2))) * np.exp(-ts * 45) * (t2 >= step_t) * (t2 < step_t + 0.08)
    s2 += step * 0.5
# Shoe brake skrrr at 0.9s (high frequency FM squeal)
t_sk = np.maximum(0, t2 - 0.9)
skrrr = np.sin(2 * np.pi * (2200 + 400 * np.sin(t_sk * 80)) * t_sk) * np.sin(np.pi * np.clip(t_sk / 0.25, 0, 1)) ** 2 * (t2 >= 0.9) * (t2 < 1.15)
s2 += skrrr * 0.65
# Neon flicker clicks at 1.3s and 1.45s
for flk in [1.3, 1.45]:
    tf = np.maximum(0, t2 - flk)
    s2 += np.random.normal(0, 0.35, len(t2)) * np.exp(-tf * 70) * (t2 >= flk) * 0.6
# Curious bell ping at 1.7s (E6 note 1318 Hz)
tp = np.maximum(0, t2 - 1.7)
ping = (np.sin(2 * np.pi * 1318.51 * tp) + 0.4 * np.sin(2 * np.pi * 2637.0 * tp)) * np.exp(-tp * 8) * (t2 >= 1.7)
s2 += ping * 0.6
save_wav("sfx_foco_carreras_linterna_casco.wav", s2)

# 3. sfx_foco_puerta_aula_reloj.wav (~2.6s)
# Squeaky classroom door creak + tense breath + slow clock tick-tock
t3 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s3 = np.zeros_like(t3)
# Door hinge creak from 0.15s to 0.9s (descending saw/friction tone)
t_cr = np.maximum(0, t3 - 0.15)
creak_env = np.sin(np.pi * np.clip(t_cr / 0.75, 0, 1)) ** 2 * (t3 >= 0.15) * (t3 < 0.9)
creak = np.sin(2 * np.pi * (480 - 180 * np.clip(t_cr / 0.75, 0, 1) + 40 * np.sin(t_cr * 120)) * t_cr) * creak_env
s3 += creak * 0.7
# Classroom wall clock ticks at 1.1s, 1.6s, 2.1s
for tick_t, pitch in [(1.1, 1600), (1.6, 1200), (2.1, 1600)]:
    tt = np.maximum(0, t3 - tick_t)
    tick = (np.sin(2 * np.pi * pitch * tt) + np.random.normal(0, 0.15, len(t3))) * np.exp(-tt * 60) * (t3 >= tick_t)
    s3 += tick * 0.4
# Low tense drone in background
t_dr3 = np.maximum(0, t3 - 0.5)
s3 += np.sin(2 * np.pi * 65 * t_dr3) * np.sin(np.pi * np.clip(t_dr3 / 2.0, 0, 1)) * 0.25
save_wav("sfx_foco_puerta_aula_reloj.wav", s3)

# 4. sfx_foco_carpeta_thud_grafica.wav (~2.6s)
# Folder dropping thud on floor + deflating bubble pop + statistical success ding
t4 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s4 = np.zeros_like(t4)
# Folder slap on wooden floor at 0.2s
t_th = np.maximum(0, t4 - 0.2)
thud = (np.sin(2 * np.pi * 90 * t_th) * np.exp(-t_th * 20) + np.random.normal(0, 0.4, len(t4)) * np.exp(-t_th * 45)) * (t4 >= 0.2)
s4 += thud * 0.8
# Tension deflating bubble pop at 0.7s (downward pitch sweep)
t_def = np.maximum(0, t4 - 0.7)
deflate = np.sin(2 * np.pi * (600 - 380 * np.clip(t_def / 0.35, 0, 1)) * t_def) * np.sin(np.pi * np.clip(t_def / 0.35, 0, 1)) ** 1.5 * (t4 >= 0.7) * (t4 < 1.1)
s4 += deflate * 0.65
# Statistical success chime ding (A5 880 Hz + E6 1318 Hz) at 1.4s
t_dg = np.maximum(0, t4 - 1.4)
ding = (np.sin(2 * np.pi * 880 * t_dg) + 0.6 * np.sin(2 * np.pi * 1318.51 * t_dg) + 0.3 * np.sin(2 * np.pi * 1760 * t_dg)) * np.exp(-t_dg * 6) * (t4 >= 1.4)
s4 += ding * 0.65
save_wav("sfx_foco_carpeta_thud_grafica.wav", s4)

# 5. sfx_foco_cine_proyector_palomitas.wav (~2.6s)
# 35mm film projector motor flutter + popcorn crunch + introspective soft synth chord
t5 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s5 = np.zeros_like(t5)
# Projector shutter flutter (24 FPS pulse ticks throughout)
for f_frame in range(int(2.4 * 24)):
    tick_time = f_frame / 24.0
    tf = np.maximum(0, t5 - tick_time)
    s5 += np.random.normal(0, 0.15, len(t5)) * np.exp(-tf * 180) * (t5 >= tick_time) * (t5 < tick_time + 0.02) * 0.35
# Popcorn crunches at 0.5s, 0.9s, 1.5s
for cr_t in [0.5, 0.9, 1.5]:
    tc = np.maximum(0, t5 - cr_t)
    crunch = np.random.normal(0, 0.35, len(t5)) * np.sin(2 * np.pi * 1400 * tc) * np.exp(-tc * 55) * (t5 >= cr_t)
    s5 += crunch * 0.45
# Introspective synth chord from 1.0s to 2.5s (Maj7: F4, A4, C5, E5)
t_ch = np.maximum(0, t5 - 1.0)
ch_env = np.sin(np.pi * np.clip(t_ch / 1.5, 0, 1)) ** 1.3 * (t5 >= 1.0)
for note in [349.23, 440.0, 523.25, 659.25]:
    s5 += np.sin(2 * np.pi * note * t_ch) * np.exp(-t_ch * 1.5) * ch_env * 0.2
save_wav("sfx_foco_cine_proyector_palomitas.wav", s5)

# 6. sfx_foco_multitud_bombillas_piano.wav (~2.6s)
# Multiple electric light clicks + bustling plaza background + warm cheerful piano cadence
t6 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s6 = np.zeros_like(t6)
# Lightbulb clicks popping on across crowd at 0.15s, 0.35s, 0.55s, 0.8s
for lb_t in [0.15, 0.35, 0.55, 0.8]:
    tb = np.maximum(0, t6 - lb_t)
    click = (np.sin(2 * np.pi * 2100 * tb) + np.random.normal(0, 0.3, len(t6))) * np.exp(-tb * 80) * (t6 >= lb_t)
    s6 += click * 0.5
# Plaza ambient murmur and laughter bed
s6 += np.random.normal(0, 0.06, len(t6)) * np.sin(np.pi * np.clip(t6 / 2.5, 0, 1)) * 0.4
# Cheerful piano chords (G -> C) from 1.0s to 2.5s
for chord_t, notes in [(1.0, [392.0, 493.88, 587.33]), (1.6, [523.25, 659.25, 783.99])]:
    tcp = np.maximum(0, t6 - chord_t)
    c_env = np.sin(np.pi * np.clip(tcp / 0.8, 0, 1)) ** 1.2 * (t6 >= chord_t)
    for n in notes:
        s6 += (np.sin(2 * np.pi * n * tcp) + 0.3 * np.sin(2 * np.pi * n * 2 * tcp)) * np.exp(-tcp * 2.5) * c_env * 0.25
save_wav("sfx_foco_multitud_bombillas_piano.wav", s6)

# 7. sfx_foco_palanca_enceste_guitarra.wav (~2.8s)
# Heavy industrial knife switch clack ("CLACK") + coffee cup swoosh + clean hoop swish + triumphant acoustic guitar
t7 = np.linspace(0, 2.8, int(SR * 2.8), endpoint=False)
s7 = np.zeros_like(t7)
# Heavy knife switch CLACK at 0.2s
t_sw7 = np.maximum(0, t7 - 0.2)
switch_clack = (np.sin(2 * np.pi * 180 * t_sw7) + np.sin(2 * np.pi * 1400 * t_sw7) + np.random.normal(0, 0.5, len(t7))) * np.exp(-t_sw7 * 50) * (t7 >= 0.2)
s7 += switch_clack * 0.85
# Coffee cup throw swoosh at 0.8s
t_thr = np.maximum(0, t7 - 0.8)
throw = np.random.normal(0, 0.25, len(t7)) * np.sin(np.pi * np.clip(t_thr / 0.2, 0, 1)) ** 2 * (t7 >= 0.8) * (t7 < 1.0)
s7 += throw * 0.55
# Clean hoop / bin rattle swish at 1.05s
t_swh = np.maximum(0, t7 - 1.05)
swish = (np.sin(2 * np.pi * 650 * t_swh) * np.exp(-t_swh * 25) + np.random.normal(0, 0.3, len(t7)) * np.exp(-t_swh * 35)) * (t7 >= 1.05)
s7 += swish * 0.7
# Triumphant acoustic guitar chord resolve (C major: C4, E4, G4, C5) from 1.3s to 2.7s
t_gt = np.maximum(0, t7 - 1.3)
gt_env = np.sin(np.pi * np.clip(t_gt / 1.4, 0, 1)) ** 1.3 * (t7 >= 1.3)
for n in [261.63, 329.63, 392.0, 523.25, 659.25]:
    s7 += (np.sin(2 * np.pi * n * t_gt) + 0.35 * np.sin(2 * np.pi * n * 2 * t_gt) + 0.15 * np.sin(2 * np.pi * n * 3 * t_gt)) * np.exp(-t_gt * 2.2) * gt_env * 0.22
save_wav("sfx_foco_palanca_enceste_guitarra.wav", s7)
print("All 7 spotlight effect SFX generated successfully!")
