
const getMinX = data => {
    return data.reduce((min, p) => p[0] < min ? p[0] : min, data[0][0]);
}

const getMaxX = data => {
    return data.reduce((max, p) => p[0] > max ? p[0] : max, data[0][0]);
}

export const getLinearRegression = (data, k, b) => {
    const x1 = getMinX(data);
    const x2 = getMaxX(data);
    const y1 = k * x1 + b;
    const y2 = k * x2 + b;
    return [[x1, y1], [x2, y2]];
}