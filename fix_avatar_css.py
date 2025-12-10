from pathlib import Path
import re

css = Path("styles/main.css").read_text(encoding="utf-8")

# Eliminamos cualquier bloque previo relacionado con avatars
patterns = [
    r"/\* === AVATARES[\s\S]*?/\* === ENLACE",   # bloques grandes antiguos
    r"/\* === AVATAR: IMAGEN[\s\S]*?=== Caja flotante C2", 
    r"/\* === Caja flotante C2[\s\S]*?=== AVATARES",
    r"/\* === AVATARES \(C2 — versión consolidada\)[\s\S]*?$"
]

cleaned = css
for pat in patterns:
    cleaned = re.sub(pat, "/* === ENLACE DESPUÉS DEL PUZZLE === */", cleaned, flags=re.MULTILINE)

# Ahora insertamos el bloque nuevo justo antes del cierre final del archivo
new_css = r"""
/* === AVATARES: SISTEMA C2 — SIMPLE, ROBUSTO Y MÓVIL === */

.avatar-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
}

.avatar-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.avatar-img {
    width: 100%;
    height: auto;
    border-radius: 14px;
    display: block;
    margin: 0 auto;
    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
}

.avatar-bubble {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    padding: 14px 16px;
    background: rgba(0,0,0,0.65);
    color: white;
    border-radius: 14px;
    font-size: 1.15rem;
    line-height: 1.45;
    text-align: left;
    backdrop-filter: blur(6px);
    display: none;
}

.avatar-bubble-text {
    white-space: pre-wrap;
    min-height: 40px;
}

#avatarBubbleClose {
    margin-top: 10px;
    background: #ffffff22;
    border: 1px solid #ffffff55;
    color: white;
    padding: 6px 14px;
    border-radius: 10px;
    font-size: 1rem;
}
"""

cleaned += "\n\n" + new_css.strip() + "\n"

Path("styles/main.css").write_text(cleaned, encoding="utf-8")
print("✔ CSS de avatares limpiado y sustituido por la versión final C2.")
