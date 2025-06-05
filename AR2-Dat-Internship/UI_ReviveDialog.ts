import {DialogWithResult} from 'Dialog';
import * as hz from 'horizon/core';
import {Pressable, Text, View} from 'horizon/ui';
import {DialogResult} from 'IDialog';
import {UI_Style} from 'UI_Style';

export class UI_ReviveDialog extends DialogWithResult<DialogResult>
{
  static propsDefinition = {};

  override Content()
  {
    return View({
      style: {
        ...UI_Style.Background,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      children: [
        View({
          style: {
            width: 700,
            height: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
          children: View({
            style: {
              width: '100',
              height: 100,
              alignItems: 'flex-start',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
            },
            children: [
              this.Button(`Revive`, () =>
              {
                this.HideWithResult(DialogResult.Buy);
              }),

              this.Button(`End`, () =>
              {
                this.HideWithResult(DialogResult.Close);
              }),
            ]
          }),
        })
      ]
    });
  }

  private Button(text: string, onClicked: () => void)
  {
    return Pressable({
      style: {
        width: 180,
        height: 60,
        backgroundColor: 'rgba(170, 163, 163, 0.9)',
      },
      onClick: () =>
      {
        onClicked();
      },
      children: Text({
        text: text,
        style: {
          width: '100',
          height: '100',
          fontSize: 30,
          ...UI_Style.TextAligntCenter,
          color: 'rgba(1,1,1,1)',
        },
      })
    });
  }
}
hz.Component.register(UI_ReviveDialog);