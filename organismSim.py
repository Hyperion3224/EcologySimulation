import math
import time
from typing import List








class Entity:
    pass

class Postion:
    x = 0
    y = 0

    def __init__(self,x,y):
        self.x = x
        self.y = y

class World:
    entities = []
    bounds = []


    def __init__(self, bounds):
        self.bounds = bounds

    def speciesInRadiusOf(self, species: str, position:Position, radius: float) -> List[Entity]:
        entitiesInRadius = []
        for entity in self.entities:
            if(entity.species != species):
                break
            entityPosX = entity.position.x
            entityPosY = entity.position.y
            dx = entityPosX - position.x
            dy = entityPosY - position.y

            len = math.hypot(dx,dy)
            if(len <= radius):
                entitiesInRadius.append(entity)

    def tick(self, prevTime:float):
        dt = time.time()- prevTime
        for entity in self.entities:
            entity.tick(dt)

class Entity:
    id = None
    species = None
    position = None
    facing = None
    world = None

    def __init__(self,world:World, species: str, id:int, position:Postion, facing: Postion):
        self.world = world
        self.id = id
        self.species = species
        self.position = position
        self.facing = facing

    def tick(dt:float) -> int:
        return -1


class Food(Entity):
    biomass = 0
    growthState = 0
    growthRate = None

    def __init__(self,world:World, id:int, position:Postion, facing:Postion, growthRate: float):
        super().__init__(world, "food",id,position,facing)
        self.growthRate = growthRate

    def tick(self, dt:float) -> int:
        # the biomass grows at whatever rate is passed in and then the growthstate increases by 1 for every 3 biomass
        self.biomass += self.growthRate * dt
        self.growthState = math.floor(self.biomass / 3) # int value never decimal
        return 1

class Organism(Entity):
    speed = 0
    size = 0
    health = 0
    hunger = 10
    reach = 1
    squirtRadius = 2
    fearRadius = 5

    def __init__(self, world:World, id:int, position:Postion, facing:Postion, speed: float, size:float, health:float):
        super().__init__(world, "organism",id,position,facing)
        self.speed = speed
        self.size = size
        self.health = health

    def tick(self,dt:float):
        #maslows hierarchy of needs for decision making
        if(self.hunger < 3):
            nearbyFood = self.world.speciesInRadiusOf("food",self.position,self.reach) #reach is currently hardcoded as 1
            if(nearbyFood.__sizeof__() != 0):
                bestFoodOption = (nearbyFood[0], nearbyFood[0].y)
                for food in nearbyFood:
                    y=0
                    
            

        
        nearbyPredators = self.world.speciesInRadiusOf("predator",self.position,self.fearRadius) #fear radius could be an inhereted trait but I didnt do that to keep it smiple
        nearbyMates = self.world.speciesInRadiusOf("organism",self.position,self.squirtRadius) #squirt radius is the breeding radius
        
        return -1
    
class Predator(Entity):
    speed = 0
    size = 0
    health = 0
    hunger = 10

    def __init__(self,world:World, id:int, position:Postion, facing:Postion, speed: float, size:float, health:float):
        super().__init__(world, "predator",id,position,facing)
        self.speed = speed
        self.size = size
        self.health = health

    def tick(dt:float):
        return -1

    
        
