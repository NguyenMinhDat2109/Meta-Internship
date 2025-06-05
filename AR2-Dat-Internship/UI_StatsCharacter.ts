import * as hz from 'horizon/core';
import {Dialog} from 'Dialog';
import {Binding, DynamicList, ScrollView, Text, View} from 'horizon/ui';
import {UI_Style} from 'UI_Style';
import {Stats} from 'IStatsManager';
import {ObserverHandle} from 'ObserverHandle';
import {CharacterManager, ICharacterManager} from 'CharacterManager';
import {RoundToPrecision} from 'Utilities';

export class UI_StatsCharacter extends Dialog
{
  static propsDefinition = {};
  private characterManager: ICharacterManager | undefined;
  private handle = new ObserverHandle();
  private statsBinding: Binding<Array<[string, number]>> = new Binding<Array<[string, number]>>([]);
  // ID, name, amount
  private statsArray: Array<[string, number]> = [];
  // private statsMap: Map<string, number> = new Map();
  override Content()
  {
    return View({
      style: {
        ...UI_Style.Background,
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        View({
          style: {
            height: 350,
            width: 300,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            alignItems: 'center',
          },
          children: [
            ScrollView({
              style: {
                width: "100",
                height: "100",
                marginTop: "3%",
              },
              contentContainerStyle: {
                width: "100",
                height: 1200,
              },
              children: [
                DynamicList({
                  data: this.statsBinding,
                  renderItem: ([name, value]: [string, number], index) =>
                  {
                    return this.StatView(name, value);
                  },
                  style: {
                    width: "100",
                    height: "100",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    alignItems: "center",
                  },
                }),
              ],
              horizontal: false,
            }),
          ]
        }),
      ],
    });
  }

  start()
  {
    let owner = this.entity.owner.get();
    if(owner === this.world.getServerPlayer())
    {
      return;
    }
    this.handle.AddObserver(this, {
      OnDidShow: () =>
      {
        this.UpdateStats();
      }
    })
  }

  private UpdateStats()
  {
    if(this.characterManager === undefined)
    {
      return;
    }
    this.statsArray = [];
    for(const key in Stats)
    {
      this.statsArray.push([key, (this.characterManager.GetCharacterStats(key) ?? 0)])
    }
    this.statsBinding.set(this.statsArray);
  }

  private StatView(name: string, value: number)
  {
    return View({
      style: {
        width: '100',
        height: 50,
      },
      children: Text({
        text: name + ': ' + RoundToPrecision(value, 2),
        style: {
          ...UI_Style.Background,
          ...UI_Style.TextAligntCenter,
          fontSize: 20,
        }
      }),
    });
  }

  public SetCharacterManager(characterManager: CharacterManager | undefined)
  {
    this.characterManager = characterManager;
  }
}
hz.Component.register(UI_StatsCharacter);