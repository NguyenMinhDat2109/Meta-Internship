import * as hz from 'horizon/core';
import {WaitForOwnerShipTransfer} from 'Utilities';

class Player_Container extends hz.Component<typeof Player_Container> {
  static propsDefinition = {
    gameManagerView: {type: hz.PropTypes.Entity},
    gameManager: {type: hz.PropTypes.Entity},
    bowWeapon: {type: hz.PropTypes.Entity},
  };

  private entityArray: hz.Entity[] = [];

  start()
  {
    this.entityArray = FetchEntites(this.props, Player_Container.propsDefinition);
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, async (player) =>
    {
      player.stopAvatarAnimation(); // ?? For meta bug: Stop anim when enter world only got in editor
      this.TranferOwnershipToPlayer(player);
      await WaitForOwnerShipTransfer(this.props.bowWeapon!, player, this);
      this.ForceHoldWeapon(player);
    });

    // Temporary fix for mobile not resetting the world when player exit world
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
      this.world.reset();
    })
  }

  private TranferOwnershipToPlayer(player: hz.Player)
  {
    this.entityArray.forEach(entity =>
    {
      entity.owner.set(player);
    });
  }

  private ForceHoldWeapon(player: hz.Player)
  {
    this.props.bowWeapon?.as(hz.GrabbableEntity).forceHold(player, hz.Handedness.Left, false);
  }
}
hz.Component.register(Player_Container);

/**
 * Fetches all assets from the props object. And pushes it to an array
 * @param props - The props object
 * @param propsDefinition - The definition of the props object
 */
function FetchEntites(props: Record<string, any>, propsDefinition: Record<string, any>): hz.Entity[]
{
  let entityArray: hz.Entity[] = [];
  for(const key in propsDefinition)
  {
    if(propsDefinition.hasOwnProperty(key))
    {
      const prop = propsDefinition[key];
      if(prop.type === hz.PropTypes.Entity)
      {
        let propValue = props[key];
        if(propValue)
        {
          entityArray.push(propValue);
        }
      }
    }
  }
  return entityArray;
}