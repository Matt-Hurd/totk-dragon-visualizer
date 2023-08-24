import { Rail } from './DragonRailTypes'; // Adjust the import to your actual file structure

export const getDragonPosition = (elapsedTimeInSeconds: number, railData: Rail): { x: number, y: number, z: number } => {
  const dragonSpeed = 5; // units per second

  // Calculate the total distance of the rail
  let totalRailDistance = 0;
  for (const point of railData.Points) {
    totalRailDistance += point.NextDistance;
  }

  // Modulo the distance to travel so the dragon loops back to the start when reaching the end
  const distanceToTravel = (elapsedTimeInSeconds * dragonSpeed) % totalRailDistance;

  let distanceTravelled = 0;

  for (let i = 0; i < railData.Points.length; i++) {
    const point = railData.Points[i];
    const segmentLength = point.NextDistance;

    if (distanceTravelled + segmentLength >= distanceToTravel) {
      // Dragon should be between this point and the next
      const remainingDistance = distanceToTravel - distanceTravelled;
      const t = remainingDistance / segmentLength;

      const nextPoint = railData.Points[(i + 1) % railData.Points.length]; // Loop back to the start if at the end
      return {
        x: point.Translate[0] + t * (nextPoint.Translate[0] - point.Translate[0]),
        y: point.Translate[1] + t * (nextPoint.Translate[1] - point.Translate[1]),
        z: point.Translate[2] + t * (nextPoint.Translate[2] - point.Translate[2]),
      };
    }

    distanceTravelled += segmentLength;
  }

  // Fallback to the first point if something unexpected happens
  const startPoint = railData.Points[0].Translate;
  return { x: startPoint[0], y: startPoint[1], z: startPoint[2] };
};
