const hexInput = document.getElementById('hex-input');
const colorPicker = document.getElementById('color-picker');
const cmykSlider = document.getElementById('cmyk-slider');
const cmykValues = document.getElementById('cmyk-values');
const rgbSlider = document.getElementById('rgb-slider');
const rgbValues = document.getElementById('rgb-values');
const hlsSlider = document.getElementById('hls-slider');
const hlsValues = document.getElementById('hls-values');

colorPicker.addEventListener('input', updateColorFromPicker);
cmykSlider.addEventListener('input', updateColorFromCMYK);
rgbSlider.addEventListener('input', updateColorFromRGB);
hlsSlider.addEventListener('input', updateColorFromHLS);
// Преобразование RGB в HLS
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // оттенок, насыщенность и яркость равны
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    // Преобразование в угол и проценты
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return [h, s, l];
}

// Преобразование HLS в RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // оттенок = серому
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Преобразование RGB в HEX
function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function updateColorFromCMYK() {
    const c = parseFloat(cmykSlider.value);
    const m = parseFloat(cmykSlider.value);
    const y = parseFloat(cmykSlider.value);
    const k = parseFloat(cmykSlider.value);

    // Рассчитываем RGB
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));

    // Обновляем значения RGB
    rgbSlider.value = r;
    rgbValues.textContent = `R: ${r}, G: ${g}, B: ${b}`;

    // Рассчитываем HLS
    const hsl = rgbToHsl(r, g, b);

    // Обновляем значения HLS
    hlsSlider.value = hsl[0];
    hlsValues.textContent = `H: ${hsl[0]}, L: ${hsl[1]}, S: ${hsl[2]}`;

    // Обновляем HEX
    hexInput.value = rgbToHex(r, g, b);
}

function updateColorFromRGB() {
    const r = parseInt(rgbSlider.value);
    const g = parseInt(rgbSlider.value);
    const b = parseInt(rgbSlider.value);

    // Рассчитываем CMYK
    const k = Math.min(1 - r / 255, 1 - g / 255, 1 - b / 255);
    const c = Math.round((1 - r / 255 - k) / (1 - k) * 100);
    const m = Math.round((1 - g / 255 - k) / (1 - k) * 100);
    const y = Math.round((1 - b / 255 - k) / (1 - k) * 100);

    // Обновляем значения CMYK
    cmykSlider.value = c;
    cmykValues.textContent = `C: ${c}, M: ${m}, Y: ${y}, K: ${Math.round(k * 100)}`;

    // Рассчитываем HLS
    const hsl = rgbToHsl(r, g, b);

    // Обновляем значения HLS
    hlsSlider.value = hsl[0];
    hlsValues.textContent = `H: ${hsl[0]}, L: ${hsl[1]}, S: ${hsl[2]}`;

    // Обновляем HEX
    hexInput.value = rgbToHex(r, g, b);
}

function updateColorFromHLS() {
    const h = parseInt(hlsSlider.value);
    const l = parseInt(hlsSlider.value);
    const s = parseInt(hlsSlider.value);

    // Рассчитываем RGB
    const rgb = hslToRgb(h, s / 100, l / 100);

    // Обновляем значения RGB
    rgbSlider.value = rgb[0];
    rgbValues.textContent = `R: ${rgb[0]}, G: ${rgb[1]}, B: ${rgb[2]}`;

    // Рассчитываем CMYK
    const k = Math.min(1 - rgb[0] / 255, 1 - rgb[1] / 255, 1 - rgb[2] / 255);
    const c = Math.round((1 - rgb[0] / 255 - k) / (1 - k) * 100);
    const m = Math.round((1 - rgb[1] / 255 - k) / (1 - k) * 100);
    const y = Math.round((1 - rgb[2] / 255 - k) / (1 - k) * 100);

    // Обновляем значения CMYK
    cmykSlider.value = c;
    cmykValues.textContent = `C: ${c}, M: ${m}, Y: ${y}, K: ${Math.round(k * 100)}`;

    // Обновляем HEX
    hexInput.value = rgbToHex(rgb[0], rgb[1], rgb[2]);
}
