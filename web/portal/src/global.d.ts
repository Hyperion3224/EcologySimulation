export {}

declare global {
    interface Window {
        seed: string,
        height: number,
        diameter: number,
        chunkSize: number,
        data: number[]
    }
}