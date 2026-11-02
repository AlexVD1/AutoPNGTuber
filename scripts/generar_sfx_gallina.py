import os
import wave
import struct
import numpy as np

def save_wav(filename, samples, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)
    with wave.open(filename, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(int_samples.tobytes())
    print(f"Generated SFX: {filename}")

def sfx_gallina_cluck_whoosh():
    sr = 44100
    dur = 0.8
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    
    # Whoosh sweep
    whoosh_freq = np.linspace(150, 600, len(t))
    noise = np.random.normal(0, 0.25, len(t))
    env_whoosh = np.exp(-((t - 0.3)**2) / 0.03)
    whoosh = noise * env_whoosh
    
    # Cluck pulses (2 brief vocal chirp harmonics)
    cluck = np.zeros_like(t)
    for t_pulse in [0.22, 0.45]:
        env_c = np.exp(-((t - t_pulse)**2) / 0.003)
        tone = np.sin(2 * np.pi * 750 * t) + 0.5 * np.sin(2 * np.pi * 1250 * t)
        cluck += tone * env_c * 0.4
        
    s = whoosh * 0.6 + cluck * 0.7
    return s / np.max(np.abs(s) + 1e-6)

def sfx_lupa_enfoque_ojo():
    sr = 44100
    dur = 0.7
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    # High-tech servo/optic whirr + focus beep
    freq = np.linspace(350, 1400, len(t))
    whirr = np.sin(2 * np.pi * freq * t) * np.exp(-3 * t)
    beep1 = np.sin(2 * np.pi * 1800 * t) * np.exp(-((t - 0.35)**2) / 0.002)
    beep2 = np.sin(2 * np.pi * 2400 * t) * np.exp(-((t - 0.45)**2) / 0.002)
    s = whirr * 0.4 + beep1 * 0.5 + beep2 * 0.4
    return s / np.max(np.abs(s) + 1e-6)

def sfx_mareo_motion_blur():
    sr = 44100
    dur = 0.9
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    # Wobble / dizziness sine with low pitch drop
    wobble = np.sin(2 * np.pi * 8 * t) # 8Hz wobble
    carrier = np.sin(2 * np.pi * (180 + 70 * wobble) * t) * np.exp(-2.2 * t)
    noise_burst = np.random.normal(0, 0.2, len(t)) * np.exp(-((t - 0.2)**2) / 0.02)
    s = carrier * 0.6 + noise_burst * 0.3
    return s / np.max(np.abs(s) + 1e-6)

def sfx_resorte_hidraulico_cuello():
    sr = 44100
    dur = 0.8
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    # Pneumatic hiss + bounce spring
    hiss = np.random.normal(0, 0.3, len(t)) * np.exp(-4 * t)
    # Spring boing with chirping frequency modulation
    spring_mod = np.sin(2 * np.pi * 25 * t)
    spring = np.sin(2 * np.pi * (450 + 150 * spring_mod) * t) * np.exp(-3.5 * t)
    s = hiss * 0.4 + spring * 0.55
    return s / np.max(np.abs(s) + 1e-6)

def sfx_gimbal_servo_auto():
    sr = 44100
    dur = 0.85
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    # Precision servo motor hum
    servo = (np.sin(2 * np.pi * 880 * t) + 0.3 * np.sin(2 * np.pi * 1760 * t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 15 * t))
    env_servo = np.exp(-((t - 0.35)**2) / 0.04)
    # Low hydraulic thud
    thud = np.sin(2 * np.pi * 75 * t) * np.exp(-6 * t)
    s = servo * env_servo * 0.45 + thud * 0.5
    return s / np.max(np.abs(s) + 1e-6)

def sfx_cierre_triunfal_gallina():
    sr = 44100
    dur = 1.1
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    # Major chord chime (C5, E5, G5, C6)
    chord = (
        np.sin(2 * np.pi * 523.25 * t) +
        np.sin(2 * np.pi * 659.25 * t) +
        np.sin(2 * np.pi * 783.99 * t) +
        0.8 * np.sin(2 * np.pi * 1046.50 * t)
    ) * np.exp(-2.2 * t)
    # Little triumphant cluck chirp at start
    cluck = np.sin(2 * np.pi * 850 * t) * np.exp(-((t - 0.15)**2) / 0.003)
    s = chord * 0.35 + cluck * 0.4
    return s / np.max(np.abs(s) + 1e-6)

if __name__ == '__main__':
    base_dir = 'public/sfx'
    save_wav(f'{base_dir}/sfx_gallina_cluck_whoosh.wav', sfx_gallina_cluck_whoosh())
    save_wav(f'{base_dir}/sfx_lupa_enfoque_ojo.wav', sfx_lupa_enfoque_ojo())
    save_wav(f'{base_dir}/sfx_mareo_motion_blur.wav', sfx_mareo_motion_blur())
    save_wav(f'{base_dir}/sfx_resorte_hidraulico_cuello.wav', sfx_resorte_hidraulico_cuello())
    save_wav(f'{base_dir}/sfx_gimbal_servo_auto.wav', sfx_gimbal_servo_auto())
    save_wav(f'{base_dir}/sfx_cierre_triunfal_gallina.wav', sfx_cierre_triunfal_gallina())
