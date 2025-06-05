import {Entity_Attachement} from 'Entity_Attachement';
import * as hz from 'horizon/core';

//FOR TEST
export class Entity_Shadow extends Entity_Attachement<typeof Entity_Shadow>
{
}
hz.Component.register(Entity_Shadow);