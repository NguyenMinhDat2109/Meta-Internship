import {DialogWithResult} from 'Dialog';
import {Event} from 'GLOBAL_UTL_Events';
import {Component} from 'horizon/core';
import {Binding, DynamicList, Image, ImageSource, Pressable, Text, UINode, View} from 'horizon/ui';
import {DialogResult} from 'IDialog';
import {SkillData} from 'Skill_Const';
import {UI_Style} from 'UI_Style';

export class UIButtonPressEvent
{
  public static OnSkillButtonPressed = new Event<boolean>('OnSkillButtonPressed'); // boolean for pause game or not
  public static OnCharacterStatsButtonPressed = new Event<boolean>('OnCharacterStatsButtonPressed');
}

export class UI_ObtainedSkillsDialog extends DialogWithResult<DialogResult>
{
  static propsDefinition = {};
  private obtainedSkills: SkillData[] = [];
  private obtainedSkillsBind: Binding<SkillData[]> = new Binding<SkillData[]>([]);
  start()
  {
  }

  override Content(): UINode
  {
    return View({
      children: [
        Text({
          text: "Already obtained skills",
          style: {
            fontSize: 40,
            fontWeight: 'bold',
            color: 'rgb(255,255,255)',
            marginVertical: 40,
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

            Pressable(({
              children: [
                Text(({
                  text: "X",
                  style: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'rgb(0, 0, 0)',
                    ...UI_Style.TextAligntCenter,
                  }
                }))
              ],
              style: {
                width: 40,
                height: 40,
                borderRadius: 30,
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgb(255, 255, 255)',
                ...UI_Style.ChildrenAlignCenter,
              },
              onPress: () =>
              {
                this.HideWithResult(DialogResult.Close);
              }
            }))
          ],
          style: {
            width: 930,
            height: 360,
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }
        })
      ],
      style: {
        width: '100',
        height: '100',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        ...UI_Style.ChildrenAlignCenter,
        position: 'absolute',
        zIndex: 1,
      }
    });
  }

  public SetObtainedSkillBinding(obtainedSkills: SkillData[])
  {
    this.obtainedSkillsBind.set(obtainedSkills);
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
Component.register(UI_ObtainedSkillsDialog);