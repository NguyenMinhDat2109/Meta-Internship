import {DialogWithResult} from 'Dialog';
import * as hz from 'horizon/core';
import {Binding, Pressable, Text, View} from 'horizon/ui';
import {DialogResult} from 'IDialog';
import {UI_Style} from 'UI_Style';
import {FormatDecimal} from 'Utilities';

export class UI_LevelFailedDialog extends DialogWithResult<DialogResult>
{
  static propsDefinition = {};
  private waveBinding = new Binding<string>('');
  private wave: number = 0;

  start()
  {
    this.SetWave(1);
  }
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
            width: 420,
            height: 300,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          },

          children: [
            Text({
              text: `Result`,
              style: {
                width: '100',
                height: 100,
                fontSize: 40,
                ...UI_Style.TextAligntCenter,
                color: 'rgba(1,1,1,1)',
              },
            }),

            Text({
              text: this.waveBinding,
              style: {
                width: '100',
                height: 100,
                fontSize: 30,
                ...UI_Style.TextAligntCenter,
                color: 'rgba(1,1,1,1)',
              },
            }),

            View({
              style: {
                width: '100',
                height: 100,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              },
              children: [
                this.Button(`OK`, () =>
                {
                  this.HideWithResult(DialogResult.Close);
                }),

                // this.Button(`End`, () =>
                // {
                //   this.HideWithResult(DialogResult.Close);
                // }),
              ]
            }),
          ],

        })
      ]
    });
  }

  private Button(text: string, onClicked: () => void)
  {
    return Pressable({
      style: {
        width: 120,
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

  public SetWave(wave: number)
  {
    this.wave = wave + 1;
    this.waveBinding.set(`Wave ${FormatDecimal(this.wave, 2)}`);
  }
}
hz.Component.register(UI_LevelFailedDialog);