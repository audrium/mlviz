const getError = (data, k, b) => {
    let total = 0;
    data.forEach(point => {
        const [x, y] = point;
        total += (y - (k * x + b)) ** 2;
    });
    return total / data.length;
}

const gradientStep = (data, k, b, learningRate) => {
    let gk = 0;
    let gb = 0;

    data.forEach(point => {
        const [x, y] = point;
        gk += -2 * x * (y - ((k * x) + b));
        gb += -2 * (y - ((k * x) + b));
    });

    k = k - ((1 / data.length) * gk * learningRate);
    b = b - ((1 / data.length) * gb * learningRate);
    return { k, b };
}

export const gradient = (data, initK = 0, initB = 0, epochStart, epochEnd, learningRate) => {
    let error = 0;
    let k = initK;
    let b = initB;
    let stepCoefs;
    let errorData = [];
    let logs = [];
    for (let epoch = epochStart; epoch < epochEnd; epoch++) {
        stepCoefs = gradientStep(data, k, b, learningRate);
        k = stepCoefs.k;
        b = stepCoefs.b;
        error = getError(data, k, b);
        errorData.push(error);
        if (epoch === 0 || epoch % 100 === 0) {
            logs.push(`Epoch: ${epoch}, k: ${k.toFixed(3)}, b: ${b.toFixed(3)}, error: ${error.toFixed(3)}`);
        }
    }
    return { k, b, errorData, logs };
}