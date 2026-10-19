namespace EcologySimulation.Models;

public class HomeModel {
  public string Seed {get; set;} = "Jaxon Durken";
  public int Height {get; set;} = 250;
  public int Diameter {get; set;} = 73;
  public int ChunkSize {get; set;} = 40;
  public float[] Data {get; set;} = {};
}
