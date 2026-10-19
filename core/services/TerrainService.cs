namespace EcologySimulation.Core.Service;

using ILGPU;
using ILGPU.Runtime;
using EcologySimulation.Core.Kernel;

public class TerrainService
{
    /// <summary>Generates a centered square world with unit-spaced vertices, including the outer edge.</summary>
    /// <param name="seed">Stable noise seed.</param>
    /// <param name="height">Maximum elevation, starting at zero.</param>
    /// <param name="diameter">Number of chunks along each side.</param>
    /// <param name="chunk">Chunk width in world units.</param>
    /// <returns>XYZ triples, X varying fastest; 3 * (diameter * chunk + 1)^2 floats.
    /// Shared chunk edges appear once.</returns>
    /// <exception cref="PlatformNotSupportedException">No CUDA or OpenCL GPU is available.</exception>
    public float[] GenerateTerrain(string seed, int height, int diameter, int chunk)
    {

        ArgumentNullException.ThrowIfNull(seed);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(height);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(diameter);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(chunk);

        long width = (long)diameter * chunk;

        if (width + 1 > Math.Sqrt(Array.MaxLength / 3))
            throw new ArgumentOutOfRangeException(nameof(diameter), "Terrain exceeds the maximum flat array length.");

        int side = (int)width + 1;
        int pointCount = side * side;
        uint seedHash = 2166136261u;
        foreach (char character in seed)
            seedHash = unchecked((seedHash ^ character) * 16777619u);

        using var context = Context.CreateDefault();
        
        var device = context.Devices
            .Where(d => d.AcceleratorType is AcceleratorType.Cuda or AcceleratorType.OpenCL)
            .OrderByDescending(d => d.AcceleratorType == AcceleratorType.Cuda)
            .FirstOrDefault()
            ?? throw new PlatformNotSupportedException("Terrain generation requires a CUDA or OpenCL GPU and its driver.");

        using var accelerator = device.CreateAccelerator(context);
        var kernel = accelerator.LoadAutoGroupedStreamKernel<Index1D,
            ArrayView1D<float, Stride1D.Dense>, int, int, int, uint>(TerrainKernel.Generate);

        using var output = accelerator.Allocate1D<float>(pointCount * 3);
        kernel(pointCount, output.View, side, height, chunk, seedHash);
        accelerator.Synchronize();

        return output.GetAsArray1D();
    }
}
