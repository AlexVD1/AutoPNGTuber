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

# 1. sfx_hormigon_olas_crujido.wav (~2.2s)
# Ocean wave rush + sharp concrete creak/crack
t1 = np.linspace(0, 2.2, int(SR * 2.2), endpoint=False)
noise = np.random.normal(0, 0.25, len(t1))
wave_env = np.sin(np.pi * t1 / 2.2) ** 1.5
wave_sound = noise * wave_env
# Concrete crack at t = 1.0s
crack = np.zeros_like(t1)
idx_crack = int(1.0 * SR)
crack_len = int(0.18 * SR)
tc = np.linspace(0, 0.18, crack_len, endpoint=False)
crack_pulse = (np.sin(2 * np.pi * 180 * tc) + 0.6 * np.random.normal(0, 0.5, crack_len)) * np.exp(-tc * 35)
crack[idx_crack:idx_crack+crack_len] += crack_pulse * 0.8
save_wav("sfx_hormigon_olas_crujido.wav", wave_sound * 0.6 + crack)

# 2. sfx_varilla_oxido_fractura.wav (~2.4s)
# Water drips, high metallic expansion groan, loud structural snap
t2 = np.linspace(0, 2.4, int(SR * 2.4), endpoint=False)
s2 = np.zeros_like(t2)
# Drip 1 at 0.3s
d1 = np.sin(2 * np.pi * 1400 * np.exp(-t2 * 12)) * np.exp(-np.maximum(0, t2 - 0.3) * 45) * (t2 >= 0.3)
# Groan at 1.0s - 1.8s
groan_t = np.maximum(0, t2 - 1.0)
groan = np.sin(2 * np.pi * (110 + 40 * groan_t) * groan_t) * np.exp(-groan_t * 2.5) * (t2 >= 1.0) * (t2 < 1.8)
# Snap at 1.8s
snap_t = np.maximum(0, t2 - 1.8)
snap = (np.sin(2 * np.pi * 320 * snap_t) + 0.8 * np.random.normal(0, 0.4, len(t2))) * np.exp(-snap_t * 30) * (t2 >= 1.8)
s2 = d1 * 0.5 + groan * 0.4 + snap * 0.8
save_wav("sfx_varilla_oxido_fractura.wav", s2)

# 3. sfx_volcan_mezcla_caldero.wav (~2.2s)
# Low volcanic rumble + bubbling cauldron + splash
t3 = np.linspace(0, 2.2, int(SR * 2.2), endpoint=False)
rumble = np.sin(2 * np.pi * (45 + 5 * np.sin(t3 * 8)) * t3) * 0.4
bubbles = np.zeros_like(t3)
for b_time, b_freq in [(0.4, 600), (0.7, 750), (1.1, 520), (1.5, 680), (1.8, 800)]:
    b_idx = int(b_time * SR)
    b_len = int(0.08 * SR)
    tb = np.linspace(0, 0.08, b_len, endpoint=False)
    bubbles[b_idx:b_idx+b_len] += np.sin(2 * np.pi * (b_freq + tb * 1200) * tb) * np.exp(-tb * 60) * 0.5
save_wav("sfx_volcan_mezcla_caldero.wav", rumble + bubbles)

# 4. sfx_cristales_minerales_crecen.wav (~2.5s)
# Underwater hum + crystalline bell glissando (tobermorite crystal growth)
t4 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
underwater = np.sin(2 * np.pi * 80 * t4) * (0.2 + 0.1 * np.sin(t4 * 4))
chimes = np.zeros_like(t4)
freqs = [880, 1174, 1396, 1760, 2093]
for idx, f in enumerate(freqs):
    c_time = 0.5 + idx * 0.35
    c_idx = int(c_time * SR)
    c_len = min(int(0.7 * SR), len(chimes) - c_idx)
    tc = np.linspace(0, c_len / SR, c_len, endpoint=False)
    chimes[c_idx:c_idx+c_len] += (np.sin(2 * np.pi * f * tc) + 0.3 * np.sin(2 * np.pi * f * 2.75 * tc)) * np.exp(-tc * 6) * 0.35
save_wav("sfx_cristales_minerales_crecen.wav", underwater + chimes)

# 5. sfx_calcio_sellado_grieta.wav (~2.3s)
# Drop impact + chemical reaction hiss + solid sealing chime/lock
t5 = np.linspace(0, 2.3, int(SR * 2.3), endpoint=False)
# Drop at 0.2s
drop_t = np.maximum(0, t5 - 0.2)
drop = np.sin(2 * np.pi * (1600 - drop_t * 6000) * drop_t) * np.exp(-drop_t * 50) * (t5 >= 0.2)
# Hiss/sizzle from 0.5s to 1.4s
hiss_t = np.maximum(0, t5 - 0.5)
hiss = np.random.normal(0, 0.2, len(t5)) * np.exp(-hiss_t * 2.0) * (t5 >= 0.5) * (t5 < 1.6)
# Lock chime at 1.5s
lock_t = np.maximum(0, t5 - 1.5)
lock = (np.sin(2 * np.pi * 1046 * lock_t) + 0.4 * np.sin(2 * np.pi * 2093 * lock_t)) * np.exp(-lock_t * 7) * (t5 >= 1.5)
save_wav("sfx_calcio_sellado_grieta.wav", drop * 0.6 + hiss * 0.5 + lock * 0.7)

# 6. sfx_submarino_peces_corriente.wav (~2.5s)
# Deep atmospheric aquatic currents + soft bubbles
t6 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
flow = np.sin(2 * np.pi * (55 + 8 * np.sin(t6 * 2)) * t6) * 0.35 + np.random.normal(0, 0.08, len(t6)) * (0.3 + 0.2 * np.sin(t6 * 3))
save_wav("sfx_submarino_peces_corriente.wav", flow)

# 7. sfx_reloj_campanilla_flash.wav (~2.6s)
# Clock ticking accelerating + crystal bell flash chime
t7 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
ticks = np.zeros_like(t7)
tick_times = [0.1, 0.45, 0.75, 1.0, 1.2, 1.35, 1.48, 1.58, 1.66]
for tt in tick_times:
    idx = int(tt * SR)
    t_len = int(0.03 * SR)
    tk = np.linspace(0, 0.03, t_len, endpoint=False)
    ticks[idx:idx+t_len] += np.sin(2 * np.pi * 2200 * tk) * np.exp(-tk * 140) * 0.5
# Flash chime at 1.8s
flash_t = np.maximum(0, t7 - 1.8)
flash = (np.sin(2 * np.pi * 1318 * flash_t) + 0.5 * np.sin(2 * np.pi * 2637 * flash_t) + 0.25 * np.sin(2 * np.pi * 3951 * flash_t)) * np.exp(-flash_t * 5) * (t7 >= 1.8)
save_wav("sfx_reloj_campanilla_flash.wav", ticks + flash * 0.7)
