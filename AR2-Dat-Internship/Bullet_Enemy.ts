import {BulletBase} from 'BulletBase';
import {Bullet_Straight} from 'Bullet_Straight';
import * as hz from 'horizon/core';

export class Bullet_Enemy extends BulletBase<typeof Bullet_Enemy>
{
  OnColliderEvent(): void
  {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) =>
    {
      if(this.IsAlive)
      {
        if(this.characterManager?.DamageReceive.CanTakeDamage())
        {
          this.characterManager?.DamageReceive.TakeDamage(this.damage, false);
          this.Kill();
        }
      }
    });
  }
}
hz.Component.register(Bullet_Enemy);