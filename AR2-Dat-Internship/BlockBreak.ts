import * as hz from "horizon/core";

export const BlockEvent = {
  PlayerOnDash : new hz.NetworkEvent<{isDash :boolean}>("PlayerOnDash"),
}

class BlockBreak extends hz.Component<typeof BlockBreak> {
    static propsDefinition = {};
    private isDash = false;

    start() {
      this.connectNetworkBroadcastEvent(BlockEvent.PlayerOnDash, (data)=>{
        this.isDash = data.isDash;
      })
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerCollision, (player: hz.Player) => {
            if (this.isDash) {
                this.entity.collidable.set(false);
            }
        });
    }
}
hz.Component.register(BlockBreak);
