using ecologysim.core.service;

var service = new TerrainService();
const int height = 80, diameter = 3, chunk = 16;
const int width = diameter * chunk, side = width + 1;
var points = service.GenerateTerrain("terrain-test", height, diameter, chunk);
Check(points.Length == side * side * 3, "Array length");
for (int z = 0; z < side; z++)
for (int x = 0; x < side; x++)
{
    int offset = (z * side + x) * 3;
    Check(points[offset] == x - width / 2f, "X coordinate");
    Check(points[offset + 2] == z - width / 2f, "Z coordinate");
    Check(float.IsFinite(points[offset + 1]) && points[offset + 1] >= 0 && points[offset + 1] <= height,
        "Finite height in range");
}
Check(points.SequenceEqual(service.GenerateTerrain("terrain-test", height, diameter, chunk)), "Repeatable seed");
var different = service.GenerateTerrain("other-seed", height, diameter, chunk);
Check(Enumerable.Range(0, side * side).Any(i => points[i * 3 + 1] != different[i * 3 + 1]), "Distinct seeds");
Check(Enumerable.Range(0, side * side).Select(i => points[i * 3 + 1]).Distinct().Count() > 10, "Height variation");
var flat = service.GenerateTerrain("flat", 0, 1, 1);
Check(flat.Length == 12 && flat[0] == -0.5f && flat[^1] == 0.5f, "Small odd-width world");
Check(Enumerable.Range(0, 4).All(i => flat[i * 3 + 1] == 0f), "Zero height");
Expect<ArgumentNullException>(() => service.GenerateTerrain(null!, 1, 1, 1));
Expect<ArgumentOutOfRangeException>(() => service.GenerateTerrain("s", -1, 1, 1));
Expect<ArgumentOutOfRangeException>(() => service.GenerateTerrain("s", 1, 0, 1));
Expect<ArgumentOutOfRangeException>(() => service.GenerateTerrain("s", 1, 1, 0));
Expect<ArgumentOutOfRangeException>(() => service.GenerateTerrain("s", 1, int.MaxValue, int.MaxValue));
Console.WriteLine($"GPU terrain checks passed: {points.Length / 3} vertices, deterministic seeds, coordinates, bounds and validation.");

static void Check(bool condition, string message)
{
    if (!condition) throw new Exception(message);
}

static void Expect<T>(Action action) where T : Exception
{
    try { action(); }
    catch (T) { return; }
    throw new Exception($"Expected {typeof(T).Name}");
}
