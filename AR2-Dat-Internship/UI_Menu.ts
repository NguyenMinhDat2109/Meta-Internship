import {Dialog, DialogWithResult} from 'Dialog';
import * as hz from 'horizon/core';
import {Pressable, Text, View} from 'horizon/ui';
import {DialogResult} from 'IDialog';
import {UI_Style} from 'UI_Style';

export class UI_Menu extends DialogWithResult<DialogResult>
{
  static propsDefinition = {};

  override Content()
  {
    return View({
      style: {
        ...UI_Style.Background,
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        //PLAY BUTTON
        Pressable({
          style: {
            width: 300,
            height: 100,
            backgroundColor: 'rgb(0, 0, 0)',
            alignItems: 'center',
            justifyContent: 'center',
          },
          children: Text({
            text: 'START',
            style: {
              fontSize: 30,
              color: 'white',
              textAlignVertical: 'center',
              textAlign: 'center',
            }
          }),
          onClick: () =>
          {
            this.HideWithResult(DialogResult.Play);
          }
        })
      ]
    });
  }
}
hz.Component.register(UI_Menu);