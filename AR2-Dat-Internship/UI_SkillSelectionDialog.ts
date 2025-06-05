import {DialogWithResult} from "Dialog";
import {Asset, Color, Component, Vec3} from "horizon/core";
import {AnimatedBinding, Animation, Binding, DynamicList, Easing, Image, ImageSource, Pressable, Text, UINode, View} from "horizon/ui";
import {UI_Style} from "UI_Style";
import {PanelData, SKILL_ICON, SKILL_ICON_LIST_LENGTH, SkillBackgroundColorMap, SkillData} from "Skill_Const";
import {DialogResult} from "IDialog";
import {Event} from "GLOBAL_UTL_Events";
import {UIButtonPressEvent} from "UI_ObtainedSkillsDialog";


export class UI_SkillSelectionDialog extends DialogWithResult<DialogResult>
{
    static propsDefinition = {};

    private skillPanelList: PanelData[] = [];
    private skillPanelListBind: Binding<PanelData[]> = new Binding<PanelData[]>(this.skillPanelList);
    private topBindingList: AnimatedBinding[] = [new AnimatedBinding(19 * 150), new AnimatedBinding(19 * 150), new AnimatedBinding(19 * 150)];
    private backgroundBindingList: Binding<Color>[] = [new Binding<Color>(new Color(0, 0, 0)), new Binding<Color>(new Color(0, 0, 0)), new Binding<Color>(new Color(0, 0, 0))];
    private skillNameBindingList: Binding<boolean>[] = [new Binding<boolean>(false), new Binding<boolean>(false), new Binding<boolean>(false)];
    public selectedSkill?: SkillData;

    start(): void
    {
        this.skillPanelListBind.set(this.skillPanelList);
    }

    override Content()
    {
        return View({
            children: [
                View({ // top panel for notifications                
                    children: [
                        View({  // level up notification                           
                            children: [
                                Text({
                                    text: "Level Up!",
                                    style: {
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: 'rgba(182, 12, 12, 1)',
                                        ...UI_Style.TextAligntCenter,
                                    }
                                })
                            ],
                            style: {
                                width: 400,
                                height: 50,
                                backgroundColor: 'rgb(175, 255, 1)',
                                ...UI_Style.ChildrenAlignCenter,
                                borderWidth: 2,
                                borderColor: 'rgba(0, 0, 0, 1)',
                            },
                        }),

                        Text({
                            text: "Choose a new skill",
                            style: {
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: 'rgb(205, 238, 16)',
                                ...UI_Style.TextAligntCenter,
                                marginTop: 15,
                            }
                        })
                    ],
                    style: {
                        width: '100',
                        height: '22',
                        alignItems: 'center',
                        // backgroundColor: 'rgba(9, 62, 238, 0.5)',
                    }
                }),

                DynamicList({
                    data: this.skillPanelListBind, renderItem: (item: PanelData, index?: number) =>
                    {
                        return this.SkillSelectionPanel(item, this.topBindingList[index!], this.backgroundBindingList[index!], this.skillNameBindingList[index!]);
                    },
                    style: {
                        width: '100',
                        height: '78',
                        // backgroundColor: 'rgba(75, 70, 4, 0.7)',
                        flexDirection: "row",
                        justifyContent: 'space-evenly',
                    }
                }),

                Pressable(({ // show learned skill button
                    children: [
                        Text(({
                            text: "Show learned skills",
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'rgb(255, 255, 255)',
                                ...UI_Style.TextAligntCenter,
                            }
                        }))
                    ],
                    style: {
                        width: 220,
                        height: 50,
                        position: 'absolute',
                        right: 0,
                        bottom: 10,
                        backgroundColor: 'rgb(0, 0, 0)',
                        ...UI_Style.ChildrenAlignCenter,
                    },
                    onPress: () =>
                    {
                        console.log("show learn skill press");
                        UIButtonPressEvent.OnSkillButtonPressed.Invoke(false);
                    }
                }))
            ],
            style: {
                ...UI_Style.Background,
                ...UI_Style.ChildrenAlignCenter,
                backgroundColor: 'rgba(29, 0, 0, 0.9)',
            },
        });
    }

    public async StartIconAnimation()
    {
        this.skillNameBindingList.forEach((bind) =>
        {
            bind.set(false);
        });
        let count = 1;
        let rarity = this.skillPanelList[0].selectedSkill.Rarity;

        this.SetIconAnimatedBinding(0);

        let interval = this.async.setInterval(() =>
        {
            if(count < rarity + 3)
            {
                for(let i = 0; i < this.skillPanelList.length; i++)
                {
                    this.SetIconAnimatedBinding(count < rarity ? count : rarity);
                }
                count++;
            }
            else
            {
                this.skillNameBindingList.forEach((bind) =>
                {
                    bind.set(true);
                });
                this.async.clearInterval(interval);
            }
        }, 1000);

    }

    private SetIconAnimatedBinding(rarity: number)
    {
        for(let i = 0; i < this.skillPanelList.length; i++)
        {
            this.topBindingList[i].set((SKILL_ICON_LIST_LENGTH - 1) * 150);
            this.topBindingList[i].set((Animation.timing(0, {duration: 1000, easing: Easing.linear})));
            this.backgroundBindingList[i].set(SkillBackgroundColorMap.get(rarity)!);
        }
    }

    public SetSkillPanelList(skillPanelList: PanelData[])
    {
        this.skillPanelList = skillPanelList;
        this.skillPanelListBind.set(this.skillPanelList);
    }

    private SkillSelectionPanel(data: PanelData, topBind: AnimatedBinding, backgroundBind: Binding<Color>, skillNameBinding: Binding<boolean>)
    {
        return Pressable({
            children: [
                UINode.if(skillNameBinding, Text({ // skill name
                    text: data.selectedSkill.Name,
                    style: {
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'rgb(0, 0, 0)',
                        textAlignVertical: 'top',
                        top: 20,
                        position: 'absolute',
                    }
                })),

                // skill icon
                this.CreateSkillIconMap(data.selectedSkill, data.iconList, topBind),

                UINode.if(skillNameBinding, View({ // skill description                  
                    children: [
                        Text({
                            text: data.selectedSkill.description,
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'rgb(255, 255, 255)',
                                ...UI_Style.TextAligntCenter,
                                padding: 5,
                            }
                        }),
                    ],
                    style: {
                        width: 250,
                        height: 150,
                        backgroundColor: 'rgb(75, 43, 43)',
                        position: 'absolute',
                        bottom: 10,
                        ...UI_Style.ChildrenAlignCenter,
                    }
                }))
            ],
            style: {
                top: 20,
                width: 300,
                height: 400,
                backgroundColor: backgroundBind,
                alignItems: 'center',
            },
            onPress: () =>
            {
                this.selectedSkill = data.selectedSkill;
                this.HideWithResult(DialogResult.Close);
            }
        });
    }

    private CreateSkillIconMap(selectedSkill: SkillData, icons: ImageSource[], topBind: AnimatedBinding): UINode
    {
        let iconMap = icons.concat().sort(() => 0.5 - Math.random());
        iconMap = icons.concat(selectedSkill.Icon);
        iconMap[0] = selectedSkill.Icon;
        return View({
            children: [
                View({
                    children:
                        iconMap.map(icon =>
                            this.CreateIconImage(icon)
                        )
                    ,
                    style: {
                        width: 150,
                        height: SKILL_ICON_LIST_LENGTH * 150,
                        justifyContent: "space-evenly",
                        flexDirection: "column-reverse",
                        bottom: topBind,
                    }

                })
            ],
            style: {
                width: 150,
                height: 150,
                flexDirection: 'column',
                top: 70,
                position: 'absolute',
                overflow: "hidden",
            }
        });
    }

    private CreateIconImage(image: ImageSource): UINode
    {
        return Image({
            source: image,
            style: {
                width: 150,
                height: 150,
            }
        });
    }
}
Component.register(UI_SkillSelectionDialog);
