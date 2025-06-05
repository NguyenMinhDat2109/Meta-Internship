import * as hz from 'horizon/core';

export async function WaitForOwnerShipTransfer(entity: hz.Entity, player: hz.Player, component: hz.Component)
{
  let tries = 0;
  const maxTries = 100; //100 tries at 100ms = 10 seconds
  let ownershipIsTransferred = entity.owner.get().id === player.id;

  while(!ownershipIsTransferred && tries < maxTries)
  {
    tries++;
    ownershipIsTransferred = entity.owner.get().id === player.id;
    await new Promise((resolve) => component.async.setTimeout(resolve, 100));
  }

  if(!ownershipIsTransferred) throw new Error(`${entity.name} ownership transfer to ${player.name} failed after ${maxTries} tries`);
}

export async function WaitForOwnerShipTransferMultiple(entities: hz.Entity[], player: hz.Player, component: hz.Component)
{
  let tries = 0;
  const maxTries = 100; //100 tries at 100ms = 10 seconds
  let ownershipIsTransferred = false;

  while(!ownershipIsTransferred && tries < maxTries)
  {
    tries++;
    ownershipIsTransferred = true;
    for(const entity of entities)
    {
      if(entity.owner.get().id !== player.id)
      {
        ownershipIsTransferred = false;
        break;
      }
    }
    await new Promise(resolve => component.async.setTimeout(resolve, 100));
  }

  if(!ownershipIsTransferred)
    throw new Error(`Multiple ownership transfer to ${player.name} failed after ${maxTries} tries`);
}

export function RandomFloat(min: number, max: number)
{
  return Math.random() * (max - min) + min;
}

/**
 * Example: RandomInt(0, 2). Result Expected are: 0, 1.
 */
export function RandomInt(min: number, max: number)
{
  return Math.floor(Math.random() * (max - min) + min);
}

export function RandomBoolean(percent: number)
{
  return Math.random() < Clamp(percent, 0, 1);
}

export function Clamp(value: number, min: number, max: number): number
{
  if(value < min) return min;
  if(value > max) return max;
  return value;
}

/**
 * Compares two floating-point numbers and determines if they are approximately equal,
 * within a specified margin of error (epsilon).
 *
 * This is useful when comparing numbers that may have rounding errors due to floating-point precision.
 *
 * @param a - The first number to compare
 * @param b - The second number to compare
 * @param epsilon - The tolerance for the comparison (default is 0.000001)
 * @returns true if the absolute difference between a and b is less than epsilon; otherwise, false
 */
export function Approximately(a: number, b: number, epsilon: number = 1e-6): boolean
{
  return Math.abs(a - b) < epsilon;
}

/**
 * Rounds a floating-point number to the specified number of decimal places,
 * accounting for floating-point precision issues using Number.EPSILON.
 *
 * @param num - The number to round.
 * @param decimalPlaces - How many decimal places to round to.
 * @returns The rounded number.
 */
export function RoundToPrecision(num: number, decimalPlaces: number): number
{
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * 
 * @param duration is second 
 * @returns 
 */
export async function Delay(comp: hz.Component, duration: number): Promise<void>
{
  await new Promise(resolve => comp.async.setTimeout(resolve, duration * 1000));
}

/**
 * It performs a 2D rotation of a vector in the XZ-plane around the Y-axis.
 * The input vector is treated as if its Y-component is 0 for the purpose of rotation,
 * and the Y-component of the returned vector remains the same as the input.
 * @param baseVector The original vector to be rotated (hz.Vec3 with x, y, z components).
 * @param angle The rotation angle in degrees.
 * @returns A new hz.Vec3 representing the rotated vector.
 */
export function RotateAroundY(baseVector: hz.Vec3, angle: number): hz.Vec3
{
  // Convert the rotation angle from degrees to radians, as required by Math.cos and Math.sin.
  const cosTheta = Math.cos(hz.degreesToRadians(angle));
  const sinTheta = Math.sin(hz.degreesToRadians(angle));

  // Calculate the new X-coordinate and Z-coordinate after rotation using the rotation formula.
  const newX = baseVector.x * cosTheta + baseVector.z * sinTheta;
  const newZ = -baseVector.x * sinTheta + baseVector.z * cosTheta;
  return new hz.Vec3(newX, baseVector.y, newZ); // Y remains unchanged
}

/**
 * Check bounce
 */
export function IsBounce(value: number, bounce: {minValue: number; maxValue: number;}): boolean
{
  return value <= bounce.minValue || value >= bounce.maxValue;
}

export function FormatDecimal(value: number, totalLength: number): string
{
  return value.toString().padStart(totalLength, '0');
}

// Utility for tracking failed assertions
export class Assert
{
  private static failedAssertions: string[] = [];

  static IsTrue(condition: boolean, message: string): void
  {
    if(!condition)
    {
      console.error(`Assertion failed: ${message}`);
      // Optionally, throw error to stop execution
      // throw new Error(`Assertion failed: ${message}`);
    }
  }

  static IsNotNull(type: any, message: string): void
  {
    if(type === undefined || type === null)
    {
      console.error(`Assertion failed: ${message}`);
    }
  }

}


