function calculateArea(shape: "circle", radius: number): number
function calculateArea(shape: "square", side: number): number

function calculateArea(shape: "circle" | "square", value: number): number{
    if (shape === "circle"){
        return Math.PI * value * value
    }
    return value * value
}

const circleArea = calculateArea("circle", 10);
const squareArea = calculateArea("square", 5);