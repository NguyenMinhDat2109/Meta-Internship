import {Dialog} from 'Dialog';
import * as hz from 'horizon/core';
import {AnimatedBinding, Animation, Binding, Easing, Image, ImageSource, Pressable, Text, UIComponent, UINode, View} from 'horizon/ui';
import {ObserverHandle} from 'ObserverHandle';
import {UIButtonPressEvent} from 'UI_ObtainedSkillsDialog';
import {UIPauseButtonPressEvent} from 'UI_PauseDialog';
import {UI_Style} from 'UI_Style';

const EXPERIENCE_BAR_EASING_TIME = 300; // ms


// export const Toggle_Boss_UI_Event = new hz.LocalEvent<{isBossWave: boolean;}>("Toggle_Boss_UI_Event");
export const Set_Boss_Hp_Percent = new hz.LocalEvent<{hp: number; maxHp: number;}>("Set_Boss_Hp_Percent_Event");
export const Set_Boss_Name_Event = new hz.LocalEvent<{name: string;}>("Set_Boss_Name_Event");

export class UI_IngameDialog extends Dialog
{
  static propsDefinition = {};

  private handle: ObserverHandle = new ObserverHandle();

  private experiencePercentBind = new AnimatedBinding(0);
  private levelTextBind = new Binding('');
  private waveTextBind = new Binding('');
  private coinTextBind = new Binding('');
  private isShowCharacterStat = false;

  private isBossWave: Binding<boolean> = new Binding<boolean>(false);
  private bossNameBind: Binding<string> = new Binding<string>("Boss Name");
  private bossHpPercentBind = new AnimatedBinding(0);

  public isSkillButtonClicked = false;
  public isPauseButtonClicked = false;
  start()
  {
    this.SetLevel(1);
    // this.SetWave(1);
    this.SetCoin(9999);
    this.ConnectBossHPBarEvents();

  }

  public ToggleBossUI(isBossWave: boolean)
  {
    this.isBossWave.set(isBossWave);
  }

  public SetBossHpPercent(hp: number, maxHp: number)
  {
    this.SetBossHp(100 * hp / maxHp);
  }

  public SetBossName(name: string)
  {
    this.bossNameBind.set(name);
  }

  private ConnectBossHPBarEvents()
  {
    // this.connectLocalBroadcastEvent<{isBossWave: boolean;}>(Toggle_Boss_UI_Event, (data) =>
    // {
    //   this.isBossWave.set(data.isBossWave);
    // });
    this.connectLocalBroadcastEvent<{hp: number; maxHp: number;}>(Set_Boss_Hp_Percent, (data) =>
    {
      this.SetBossHp(100 * data.hp / data.maxHp);
    });
    this.connectLocalBroadcastEvent<{name: string;}>(Set_Boss_Name_Event, (data) =>
    {
      this.bossNameBind.set(data.name);
    });
  }


  override Content()
  {
    return View({
      style: {
        ...UI_Style.Background,
        justifyContent: 'space-between',
        // backgroundColor: 'rgb(0, 0, 0)',
      },
      children: [
        //HEADER  
        View({
          style: {
            width: '100',
            height: '20',
            marginTop: '1',
            justifyContent: 'flex-start',
            alignItems: 'center',

          },
          children: [
            this.WaveBar(this.waveTextBind),
          ],
        }),

        //BOTTOM  
        View({
          style: {
            width: '100',
            height: '10',
            marginTop: '2',
            alignItems: 'flex-end',
            // backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          children: [
            this.HeaderMiddleContainer(),
          ],
        }),

        Pressable({
          style: {
            width: 100,
            height: 50,
            backgroundColor: 'rgb(255, 255, 255)',
            top: 100,
            left: 10,
            borderWidth: 2,
            borderRadius: 1,
            position: 'absolute',
            ...UI_Style.ChildrenAlignCenter,
          },
          children: [
            Text({
              text: "Pause",
              style: {
                fontSize: 20,
                color: 'rgb(0, 0, 0)',
                ...UI_Style.TextAligntCenter,
              }
            })
          ],
          onPress: () =>
          {
            console.log("Pause button press " + this.isPauseButtonClicked);

            this.isPauseButtonClicked = !this.isPauseButtonClicked;
            UIPauseButtonPressEvent.OnPauseButtonPressed.Invoke(this.isPauseButtonClicked);
          }
        }),
        Pressable({
          style: {
            width: 100,
            height: 30,
            backgroundColor: 'rgb(170, 25, 25)',
            top: 100,
            right: 10,
            position: 'absolute',
            ...UI_Style.ChildrenAlignCenter,
          },
          children: [
            Text({
              text: "Stats",
              style: {
                fontSize: 20,
                ...UI_Style.TextAligntCenter,
              }
            })
          ],
          onPress: () =>
          {
            this.isShowCharacterStat = !this.isShowCharacterStat;
            UIButtonPressEvent.OnCharacterStatsButtonPressed.Invoke(this.isShowCharacterStat);
          }
        })
      ]
    });
  }

  private WaveBar(waveBind: Binding<string>)
  {
    return View({
      style: {
        width: '5.5',
        height: '30',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(0, 0, 0)',
        borderRadius: 15,
      },
      children: [
        Text({
          text: waveBind,
          style: {
            fontSize: 30,
            // ...UI_Style.TextShadow,
          }
        }),
      ],
    });
  }

  private LevelText(levelTextBind: Binding<string>)
  {
    return Text({
      text: levelTextBind,
      style: {
        height: '100',
        fontSize: 29,
        ...UI_Style.TextShadow,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        layoutOrigin: [0, 0],
        transformOrigin: ['100', '50'],
        position: 'absolute',
        borderRadius: 8,
        paddingHorizontal: 10,
        ...UI_Style.TextAligntCenter,
        // alignSelf: 'flex-end',
      }
    });
  }

  private HeaderMiddleContainer()
  {
    return View({
      style: {
        width: '100',
        height: '45',
      },
      children: [

        UINode.if(this.isBossWave,
          View({
            style: {
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              alignItems: 'center',
              // backgroundColor: 'rgb(153, 0, 255)',
            },
            children: [
              Text({
                text: this.bossNameBind,
                style: {
                  fontSize: 22,
                  color: 'white',
                  marginBottom: 5,
                  fontWeight: 'bold',
                  ...UI_Style.TextAligntCenter,
                }
              }),
              this.BossHpBar(this.bossHpPercentBind)
            ]
          }),
          View({
            style: {
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'rgb(255, 0, 0)',
            },
            children: [
              // this.LevelText(this.levelTextBind),
              this.ExperienceBar(this.experiencePercentBind),
              this.CoinBar(this.coinTextBind),
              View({
                style: {
                  height: '100',
                  position: 'absolute',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  left: '28',
                  alignItems: 'flex-end',
                },
                children: [
                  this.LevelText(this.levelTextBind),
                ]
              })
            ]
          }),
        )
      ]
    });
  }

  private CoinBar(coinBind: Binding<string>)
  {
    return View({
      style: {
        width: '6',
        height: '100',
        right: '22',
        justifyContent: 'flex-start',
        position: 'absolute',
        flexDirection: 'row',
      },
      children: [
        Text({
          text: coinBind,
          style: {
            fontSize: 29,
            height: '100',
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
            paddingLeft: '60',
            paddingRight: '10',
            textAlignVertical: 'center',
            minWidth: '100',
            ...UI_Style.TextShadow,
          }
        }),

        View({
          style: {
            width: '60',
            height: '100',
            justifyContent: 'center',
          },
          children: Image({
            //FOR TEST
            source: ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt('2313430932390852'), BigInt('9695885660474885'))),
            style: {
              height: '90',
              resizeMode: 'center',
            }
          }),
        }),
      ]
    });
  }

  private ExperienceBar(experiencePercentBind: AnimatedBinding): UINode
  {
    return View({
      style: {
        width: '40',
        height: '100',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        View({
          children:
            View({
              style: {
                position: 'absolute',
                backgroundColor: 'rgb(255,235,10)',
                width: experiencePercentBind.interpolate([0, 100], ['0', '100']),
                height: '100',
              }
            }),
          style: {
            width: '100',
            height: '100',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
          }
        }),
      ],
    });
  }

  public SetExperience(percentExperience: number)
  {
    this.experiencePercentBind.stopAnimation();
    this.experiencePercentBind.set(Animation.timing(percentExperience, {duration: EXPERIENCE_BAR_EASING_TIME, easing: Easing.linear}));
  }

  public SetExperienceWhenLevelUp(percentExperience: number)
  {
    // the whole experience bar will increase to 100 then reset to 0 and animate to the new value.
    this.experiencePercentBind.set(Animation.timing(100, {duration: EXPERIENCE_BAR_EASING_TIME, easing: Easing.linear}), () =>
    {
      this.experiencePercentBind.set(0);
      this.experiencePercentBind.set((Animation.timing(percentExperience, {duration: EXPERIENCE_BAR_EASING_TIME, easing: Easing.linear})));
    });
  }

  public SetLevel(level: number)
  {
    this.levelTextBind.set(`Level ${level}`);
  }

  public SetWave(wave: number)
  {
    this.waveTextBind.set(`${wave + 1}`);
  }

  public SetCoin(coin: number)
  {
    this.coinTextBind.set(`${coin}`);
  }

  public ResetLevel() 
  {
    this.SetWave(0);
    this.SetLevel(0);
    this.experiencePercentBind.set(0);
  }


  private BossHpBar(experiencePercentBind: AnimatedBinding): UINode
  {
    return View({
      style: {
        width: '40',
        height: '100',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        View({
          children:
            View({
              style: {
                position: 'absolute',
                backgroundColor: 'rgb(255, 39, 10)',
                width: experiencePercentBind.interpolate([0, 100], ['0', '100']),
                height: '100',
              }
            }),
          style: {
            width: '100',
            height: '100',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
          }
        }),
      ],
    });
  }

  public SetBossHp(percentBossHp: number)
  {
    this.bossHpPercentBind.stopAnimation();
    this.bossHpPercentBind.set(Animation.timing(percentBossHp, {duration: EXPERIENCE_BAR_EASING_TIME, easing: Easing.linear}));
  }
}


hz.Component.register(UI_IngameDialog);