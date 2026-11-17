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

# 1. sfx_escape_recto_detonacion_vidrio.wav (~2.6s)
# Key click + 4 violent engine backfire pops (BANG-BANG-BANG-POW) + glass crash
t1 = np.linspace(0, 2.6, int(SR * 2.6), endpoint=False)
s1 = np.zeros_like(t1)
# Key click at 0.1s
t_click = np.maximum(0, t1 - 0.1)
s1 += np.sin(2 * np.pi * 2200 * t_click) * np.exp(-t_click * 80) * (t1 >= 0.1) * 0.4
# Backfire pops at 0.5s, 0.8s, 1.1s, 1.4s
for p_time, amp in [(0.5, 0.8), (0.78, 0.85), (1.05, 0.9), (1.35, 1.0)]:
    tp = np.maximum(0, t1 - p_time)
    bang_low = np.sin(2 * np.pi * 75 * np.exp(-tp * 8)) * np.exp(-tp * 14)
    bang_noise = np.random.normal(0, 0.5, len(t1)) * np.exp(-tp * 20)
    s1 += (bang_low * 0.7 + bang_noise * 0.5) * (t1 >= p_time) * amp
# Glass window shattering at 1.4s to 2.4s
t_glass = np.maximum(0, t1 - 1.4)
glass_noise = np.random.normal(0, 0.35, len(t1)) * np.exp(-t_glass * 4.5)
glass_tinkle = (np.sin(2 * np.pi * 3200 * t_glass) + np.sin(2 * np.pi * 4800 * t_glass) + np.sin(2 * np.pi * 6400 * t_glass)) * np.exp(-t_glass * 6.0)
s1 += (glass_noise * 0.5 + glass_tinkle * 0.4) * (t1 >= 1.4)
save_wav("sfx_escape_recto_detonacion_vidrio.wav", s1)

# 2. sfx_cilindro_explosion_presion_sonometro.wav (~2.4s)
# Piston combustion thud + supersonic gas rush + 115dB warning beeps
t2 = np.linspace(0, 2.4, int(SR * 2.4), endpoint=False)
s2 = np.zeros_like(t2)
# Internal combustion at 0.2s
t_comb = np.maximum(0, t2 - 0.2)
comb_thud = np.sin(2 * np.pi * 60 * np.exp(-t_comb * 5)) * np.exp(-t_comb * 10) * (t2 >= 0.2)
# Gas whoosh escaping at 0.5s
t_gas = np.maximum(0, t2 - 0.5)
gas_whoosh = np.random.normal(0, 0.4, len(t2)) * np.sin(np.pi * np.clip(t_gas / 0.8, 0, 1)) * (t2 >= 0.5) * (t2 < 1.3)
# Sonometer 115dB alert beeps at 1.2s, 1.5s, 1.8s
for b_time in [1.2, 1.5, 1.8]:
    tb = np.maximum(0, t2 - b_time)
    s2 += np.sin(2 * np.pi * 1850 * tb) * np.exp(-tb * 30) * (t2 >= b_time) * (t2 < b_time + 0.15) * 0.45
s2 += comb_thud * 0.7 + gas_whoosh * 0.6
save_wav("sfx_cilindro_explosion_presion_sonometro.wav", s2)

# 3. sfx_soldadura_chisporroteo_expansion_gas.wav (~2.5s)
# Welding sparks sizzle (bzzz-crackle) + smooth gas expansion sigh (fssshhh)
t3 = np.linspace(0, 2.5, int(SR * 2.5), endpoint=False)
s3 = np.zeros_like(t3)
# Welding from 0.1s to 1.3s
t_weld = np.maximum(0, t3 - 0.1)
weld_hum = (np.sin(2 * np.pi * 120 * t3) + 0.4 * np.sin(2 * np.pi * 240 * t3)) * (t3 >= 0.1) * (t3 < 1.3)
weld_crackle = np.random.normal(0, 0.35, len(t3)) * (np.random.random(len(t3)) > 0.85) * (t3 >= 0.1) * (t3 < 1.3)
# Expansion relief sigh from 1.3s to 2.4s
t_sigh = np.maximum(0, t3 - 1.3)
sigh_env = np.sin(np.pi * np.clip(t_sigh / 1.1, 0, 1)) ** 1.8
sigh_noise = np.random.normal(0, 0.25, len(t3)) * sigh_env * (t3 >= 1.3)
s3 = weld_hum * 0.35 + weld_crackle * 0.6 + sigh_noise * 0.65
save_wav("sfx_soldadura_chisporroteo_expansion_gas.wav", s3)

# 4. sfx_fibra_vidrio_crujido_friccion_calor.wav (~2.3s)
# Fiberglass crunch texture + screech acoustic dissipation down to muffled calm
t4 = np.linspace(0, 2.3, int(SR * 2.3), endpoint=False)
s4 = np.zeros_like(t4)
# Soft crunch from 0.1s to 0.8s
crunch_noise = np.random.normal(0, 0.3, len(t4)) * (np.sin(np.pi * np.clip(t4 / 0.8, 0, 1)) ** 2) * (t4 < 0.8)
# High frequency wave dissipating at 0.8s to 2.1s
t_diss = np.maximum(0, t4 - 0.8)
diss_freq = 2400 * np.exp(-t_diss * 3.5) + 120
diss_tone = np.sin(2 * np.pi * diss_freq * t_diss) * np.exp(-t_diss * 2.8) * (t4 >= 0.8)
s4 = crunch_noise * 0.5 + diss_tone * 0.55
save_wav("sfx_fibra_vidrio_crujido_friccion_calor.wav", s4)

# 5. sfx_deflectores_compas_division_ondas.wav (~2.2s)
# Metallic baffle tap + split dual sine wave hum
t5 = np.linspace(0, 2.2, int(SR * 2.2), endpoint=False)
s5 = np.zeros_like(t5)
# Tap at 0.15s
t_tap = np.maximum(0, t5 - 0.15)
tap = (np.sin(2 * np.pi * 880 * t_tap) + 0.5 * np.sin(2 * np.pi * 1760 * t_tap)) * np.exp(-t_tap * 40) * (t5 >= 0.15)
# Dual tone hum at 0.5s to 2.1s (frequency split)
t_hum = np.maximum(0, t5 - 0.5)
hum_env = np.sin(np.pi * np.clip(t_hum / 1.6, 0, 1))
tone1 = np.sin(2 * np.pi * 330 * t_hum)
tone2 = np.sin(2 * np.pi * 335 * t_hum) # Subtle acoustic beat
s5 = tap * 0.6 + (tone1 + tone2) * 0.25 * hum_env * (t5 >= 0.5)
save_wav("sfx_deflectores_compas_division_ondas.wav", s5)

# 6. sfx_interferencia_cancelacion_silencio_puf.wav (~2.3s)
# Dual wave clash -> sudden pop -> absolute quiet with soft laminar airflow
t6 = np.linspace(0, 2.3, int(SR * 2.3), endpoint=False)
s6 = np.zeros_like(t6)
# Swell to collision at 0.0s to 0.9s
swell_t = np.clip(t6 / 0.9, 0, 1)
swell = (np.sin(2 * np.pi * 440 * t6) + np.sin(2 * np.pi * 445 * t6)) * (swell_t ** 2) * (t6 < 0.9) * 0.4
# Cancellation pop at 0.9s
t_pop = np.maximum(0, t6 - 0.9)
pop = np.sin(2 * np.pi * 180 * t_pop) * np.exp(-t_pop * 60) * (t6 >= 0.9)
# Smooth laminar air flow (quiet fufff) from 1.0s to 2.2s
t_air = np.maximum(0, t6 - 1.0)
air_env = np.sin(np.pi * np.clip(t_air / 1.2, 0, 1)) ** 2
air = np.random.normal(0, 0.12, len(t6)) * air_env * (t6 >= 1.0)
s6 = swell + pop * 0.7 + air * 0.4
save_wav("sfx_interferencia_cancelacion_silencio_puf.wav", s6)

# 7. sfx_kart_ronroneo_suave_aplausos_victoria.wav (~2.8s)
# Soft 4-stroke engine purr ("purrrr") + gentle distant applause + victory shimmer
t7 = np.linspace(0, 2.8, int(SR * 2.8), endpoint=False)
s7 = np.zeros_like(t7)
# Engine purr (30 Hz fundamental with smooth harmonics)
purr_env = np.clip(t7 / 0.5, 0, 1) * np.exp(-np.maximum(0, t7 - 2.2) * 2.5)
purr = (np.sin(2 * np.pi * 32 * t7) + 0.4 * np.sin(2 * np.pi * 64 * t7) + 0.2 * np.sin(2 * np.pi * 96 * t7)) * purr_env
# Distant applause at 1.0s to 2.7s
t_app = np.maximum(0, t7 - 1.0)
app_env = np.sin(np.pi * np.clip(t_app / 1.7, 0, 1))
applause = np.random.normal(0, 0.15, len(t7)) * (np.random.random(len(t7)) > 0.6) * app_env * (t7 >= 1.0)
# Warm victory chime at 1.2s
t_chime = np.maximum(0, t7 - 1.2)
chime = (np.sin(2 * np.pi * 880 * t_chime) + np.sin(2 * np.pi * 1320 * t_chime)) * np.exp(-t_chime * 3.5) * (t7 >= 1.2) * 0.25
s7 = purr * 0.55 + applause * 0.5 + chime
save_wav("sfx_kart_ronroneo_suave_aplausos_victoria.wav", s7)

print("All 7 SFX successfully synthesized!")
