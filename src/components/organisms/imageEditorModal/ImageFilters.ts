// src/components/organisms/imageEditorModal/ImageFilters.ts

export const IDENTITY_MATRIX = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
];

export const GRAYSCALE_MATRIX = [
    0.2126, 0.7152, 0.0722, 0, 0,
    0.2126, 0.7152, 0.0722, 0, 0,
    0.2126, 0.7152, 0.0722, 0, 0,
    0,      0,      0,      1, 0,
];

export const SEPIA_MATRIX = [
    0.393, 0.769, 0.189, 0, 0,
    0.349, 0.686, 0.168, 0, 0,
    0.272, 0.534, 0.131, 0, 0,
    0,     0,     0,     1, 0,
];

export const INVERT_MATRIX = [
   -1,  0,  0,  0, 1,
    0, -1,  0,  0, 1,
    0,  0, -1,  0, 1,
    0,  0,  0,  1, 0,
];

export const getBrightnessMatrix = (amount: number): number[] => {
    // amount is 0 to 2, 1 is neutral. Offset ranges from -1 to 1.
    const b = amount - 1.0;
    return [
        1, 0, 0, 0, b,
        0, 1, 0, 0, b,
        0, 0, 1, 0, b,
        0, 0, 0, 1, 0,
    ];
};

export const getSaturationMatrix = (amount: number): number[] => {
    const R = 0.213 * (1 - amount);
    const G = 0.715 * (1 - amount);
    const B = 0.072 * (1 - amount);
    return [
        R + amount, G,          B,          0, 0,
        R,          G + amount, B,          0, 0,
        R,          G,          B + amount, 0, 0,
        0,          0,          0,          1, 0,
    ];
};

export const getContrastMatrix = (amount: number): number[] => {
    // Math for contrast: offset is centered around halfway point (0.5 for normalized 0-1)
    const t = (1.0 - amount) / 2.0;
    return [
        amount, 0,      0,      0, t,
        0,      amount, 0,      0, t,
        0,      0,      amount, 0, t,
        0,      0,      0,      1, 0,
    ];
};

export function multiplyColorMatrix(m1: number[], m2: number[]): number[] {
    const result = new Array(20).fill(0);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += m1[i * 5 + k] * m2[k * 5 + j];
            }
            if (j === 4) {
                sum += m1[i * 5 + 4]; // The translation component
            }
            result[i * 5 + j] = sum;
        }
    }
    return result;
}

export const PRESET_FILTERS = [
    { id: 'none', label: 'Normal', matrix: IDENTITY_MATRIX },
    { id: 'grayscale', label: 'Grayscale', matrix: GRAYSCALE_MATRIX },
    { id: 'sepia', label: 'Sepia', matrix: SEPIA_MATRIX },
    { id: 'invert', label: 'Invert', matrix: INVERT_MATRIX },
];
