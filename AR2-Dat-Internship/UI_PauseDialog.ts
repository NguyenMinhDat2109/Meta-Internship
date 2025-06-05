import {DialogWithResult} from 'Dialog';
import {Event} from 'GLOBAL_UTL_Events';
import {World2p, Matchmaking} from 'horizon/2p';
import {Component} from 'horizon/core';
import {Binding, DynamicList, Image, ImageSource, Pressable, Text, UINode, View} from 'horizon/ui';
import {DialogResult} from 'IDialog';
import {SkillData} from 'Skill_Const';
import {UI_Style} from 'UI_Style';

export class UIPauseButtonPressEvent
{
  public static OnPauseButtonPressed = new Event<boolean>('OnPauseButtonPressed'); // boolean for pause game or not
  public static OnCharacterStatsButtonPressed = new Event<boolean>('OnCharacterStatsButtonPressed');
}

const AR2_Lobby_Id = "579822725225099";

export class UI_PauseDialog extends DialogWithResult<DialogResult>
{
  static propsDefinition = {};
  private obtainedSkills: SkillData[] = [];
  private obtainedSkillsBind: Binding<SkillData[]> = new Binding<SkillData[]>([]);
  start()
  {
  }

  override Content(): UINode
  {
    console.log("This is UI_PauseDialog");
    return View({
      children: [
        Text({
          text: "Already obtained skills",
          style: {
            fontSize: 40,
            fontWeight: 'bold',
            color: 'rgb(255,255,255)',
            marginHorizontal: 20,
            // backgroundColor: 'rgba(0, 255, 76, 0.95)',
          }
        }),

        View({
          children: [
            View({
              children: [
                DynamicList({
                  data: this.obtainedSkillsBind, renderItem: (item: SkillData, index?: number) =>
                  {
                    return this.CreateIconImage(item.Icon);
                  },
                  style: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginLeft: 5,
                    marginTop: 5,
                  }
                }),
              ],
              style: {
                width: 890,
                height: 340,
                backgroundColor: 'rgb(61, 63, 57)',
              }
            }),

          ],
          style: {
            width: 930,
            height: 360,
            // backgroundColor: 'rgba(17, 0, 255, 0.95)',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }
        }),

        View({
          children: [
            View({
              children: [
                Pressable(({
                  children: [
                    Text(({
                      text: "Return to Lobby",
                      style: {
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'rgb(0, 0, 0)',
                        ...UI_Style.TextAligntCenter,
                      }
                    }))
                  ],
                  style: {
                    width: 250,
                    height: 70,
                    top: 0,
                    marginHorizontal: 40,
                    position: 'relative',
                    backgroundColor: 'rgb(255, 255, 255)',
                    ...UI_Style.ChildrenAlignCenter,
                  },
                  onPress: (player) =>
                  {
                    const world2P = new World2p(this.world);
                    this.world.ui.showPopupForPlayer(player, "Return to Lobby", 99);
                    world2P.startGroupTravel(AR2_Lobby_Id, [player]);
                    // this.HideWithResult(DialogResult.Close);
                  }
                })),
                Pressable(({
                  children: [
                    Text(({
                      text: "Resume",
                      style: {
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'rgb(0, 0, 0)',
                        ...UI_Style.TextAligntCenter,
                      }
                    }))
                  ],
                  style: {
                    width: 250,
                    height: 70,
                    top: 0,
                    marginHorizontal: 40,
                    position: 'relative',
                    backgroundColor: 'rgb(255, 255, 255)',
                    ...UI_Style.ChildrenAlignCenter,
                  },
                  onPress: () =>
                  {
                    this.HideWithResult(DialogResult.Close);
                  }
                })),
              ],
              style: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }
            }),
          ],
          style: {
            marginTop: 40,
            width: 930,
            height: 100,
            // backgroundColor: 'rgba(255, 145, 0, 0.95)',
            alignItems: 'center',
            justifyContent: 'flex-end',
            ...UI_Style.ChildrenAlignCenter,
          }

        }),
      ],
      style: {
        width: '100',
        height: '100',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        // backgroundColor: 'rgba(255, 0, 0, 0.95)',
        ...UI_Style.ChildrenAlignCenter,
        position: 'absolute',
        zIndex: 1,
      }
    });
  }

  public SetObtainedSkillBinding(pause: SkillData[])
  {
    this.obtainedSkillsBind.set(pause);
  }

  private CreateIconImage(image: ImageSource): UINode
  {
    return Image({
      source: image,
      style: {
        width: 100,
        height: 100,
        marginHorizontal: 5,
        marginVertical: 5,
      }
    });
  }
}
Component.register(UI_PauseDialog);