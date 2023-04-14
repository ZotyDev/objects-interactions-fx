export class Helpers
{
    static async RandomMax(max)
    {
        return Math.floor(Math.random() * max + 1);
    }

    static async RandomMinMax(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static GetCornersOfToken(token)
    {
        const width = token.width * game.canvas.dimensions.size;
        const height = token.height * game.canvas.dimensions.size;
        const corners = [
            {
                x: token.x - width / 2,
                y: token.y - height / 2
            },
            {
                x: token.x + width / 2,
                y: token.y - height / 2
            },
            {
                x: token.x + width / 2,
                y: token.y + height / 2
            },
            {
                x: token.x - width / 2,
                y: token.y + height / 2
            }
        ];

        return corners;
    }
}