using ILGPU;
using ILGPU.Runtime;

namespace EcologySimulation.Core.Kernel;

internal static class TerrainKernel
{
    // One GPU thread writes one complete vertex using primitive arithmetic.
    internal static void Generate(Index1D index, ArrayView1D<float, Stride1D.Dense> output,
        int side, int height, int chunkSize, uint seed)
    {
        int x = index % side;
        int z = index / side;
        float nx = (float)x / chunkSize;
        float nz = (float)z / chunkSize;
        float value = (ValueNoise(nx, nz, seed)
            + 0.5f * ValueNoise(nx * 2f, nz * 2f, seed + 1u)
            + 0.25f * ValueNoise(nx * 4f, nz * 4f, seed + 2u)) / 1.75f;
        int offset = index * 3;
        float halfWidth = (side - 1) * 0.5f;
        output[offset] = x - halfWidth;
        output[offset + 1] = value * height;
        output[offset + 2] = z - halfWidth;
    }

    private static float ValueNoise(float x, float z, uint seed)
    {
        int ix = (int)x;
        int iz = (int)z;
        float tx = x - ix;
        float tz = z - iz;
        tx = tx * tx * (3f - 2f * tx);
        tz = tz * tz * (3f - 2f * tz);
        float a = Hash(ix, iz, seed);
        float b = Hash(ix + 1, iz, seed);
        float c = Hash(ix, iz + 1, seed);
        float d = Hash(ix + 1, iz + 1, seed);
        float top = a + (b - a) * tx;
        float bottom = c + (d - c) * tx;
        return top + (bottom - top) * tz;
    }

    private static float Hash(int x, int z, uint seed)
    {
        uint hash = unchecked((uint)x * 374761393u + (uint)z * 668265263u + seed);
        hash = unchecked((hash ^ (hash >> 13)) * 1274126177u);
        hash ^= hash >> 16;
        return (hash & 0x00ffffffu) / 16777215f;
    }
}
