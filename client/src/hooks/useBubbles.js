export const generateBubbles = (count) => {
    return Array.from({ length: count }, (_, i) => {
        const size = `${(Math.random() * 4 + 2).toFixed(2)}rem`;
        const distance = `${(Math.random() * 4 + 6).toFixed(2)}rem`;
        const position = `${(Math.random() * 100).toFixed(2)}%`;
        const time = `${(Math.random() * 2 + 2).toFixed(2)}s`;
        const delay = `${(Math.random() * -4).toFixed(2)}s`;

        return {
            id: i,
            style: {
                "--size": size,
                "--distance": distance,
                "--position": position,
                "--time": time,
                "--delay": delay
            }
        };
    });
}
