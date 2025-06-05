import {ConfigManager} from "ConfigManager";
import {SkillRewardItems} from "Config_Skills";
import {ImageSource} from "horizon/ui";
import {EffectManager, EffectManagerExtensions} from "IEffectManager";
import {IServiceLocator, ServiceLocator} from "ServiceLocator";
import {PanelData, RandomBaseWeights, SKILL_ICON, SKILL_ICON_LIST_LENGTH, SkillData, SkillRarity, SkillCategory} from "Skill_Const";
import {CharacterManager} from "CharacterManager";

export class SkillSelectionManager 
{
  private readonly serviceLocator: IServiceLocator;
  private configManager: ConfigManager;
  private selectedSkills: SkillData[] = [];
  private skillsPool: SkillData[] = [];
  private disabledSkillRarity: SkillRarity[] = [];

  constructor(serviceLocator: IServiceLocator)
  {
    this.serviceLocator = serviceLocator;
    this.configManager = ServiceLocator.Instance.Resolve<ConfigManager>(ConfigManager);
    this.skillsPool = this.configManager.GetAllSkillDataArray().filter(skill => !(this.configManager.GetLockedSkillsID().includes(skill.ID)));
  }

  private ApplySkill(skillData: SkillData)
  {
    const skillRewards = SkillRewardItems[skillData.ID];
    const effectManager = this.serviceLocator.Resolve<EffectManager>(EffectManager);

    for(const skillReward of skillRewards)
    {
      switch(skillReward.SkillCategory)
      {
        case SkillCategory.Recovery:
          let healdItems = skillReward.SkillRewardItems;
          for(const item of healdItems)
          {
            this.serviceLocator.Resolve<CharacterManager>(CharacterManager).HealReceive.Heal(false,item.Amount)
          }
          
        case SkillCategory.PlayerStats:
        case SkillCategory.ProjectileStats:
          let rewardItems = skillReward.SkillRewardItems;
          for(const item of rewardItems)
          {
            EffectManagerExtensions.ApplyItem(effectManager, item.SkillID, 999, undefined, item.Amount);
          }

          break;
      }
    }
  }

  public GetSelectedSkills(): SkillData[]
  {
    return this.selectedSkills;
  }

  public OnGetSelectedSkill(skillData: SkillData)
  {
    this.ApplySkill(skillData);
    const isSelected = this.selectedSkills.includes(skillData);
    skillData.Reobtains--;
    if(skillData.Reobtains === -1) // Out of obtains then remove
    {
      const index = this.skillsPool.findIndex(skill => skill.ID === skillData.ID);
      if(index !== -1)
      {
        this.skillsPool.splice(index, 1);
      }
    }

    if(isSelected)
    {
      return;
    }
    this.selectedSkills.push(skillData);
    // Remove skills from the pool that are out of reobtains
    const unlockSkillIDs = skillData.UnlockSkillIds;
    unlockSkillIDs.forEach(id =>
    {
      // Check if skill is already in pool
      const exists = this.skillsPool.some(skill => skill.ID === id);

      if(!exists)
      {
        // Assuming you have a source of all skills to pull from
        const newSkill = this.configManager.GetSkillConfig(id);
        if(newSkill)
        {
          this.skillsPool.push(newSkill);
        }
      }
    });
  }


  public RandomizeSkillSelection(): PanelData[]
  {
    const randomRarity = this.RandomizeRarity(this.disabledSkillRarity);

    // Filter skills by the random rarity
    let filterRaritySkills = this.skillsPool.filter(skill => skill.Rarity == randomRarity);

    if(filterRaritySkills.length === 0)
    {
      console.error("No skills available with the selected rarity.");
      return [];
    }

    // Remove the rarity that has only 1 skill available from the next randomization
    if(filterRaritySkills.length === 1) 
    {
      let unlockedSkill = this.configManager?.GetSkillRequirement(filterRaritySkills[0].ID);
      if(!unlockedSkill)
      {
        this.disabledSkillRarity.push(randomRarity);
      }
    }

    // Select 3 random skills (or less)
    const skillList = this.GetRandomSkills(filterRaritySkills, 3);
    let panelList: PanelData[] = [];
    skillList.forEach((skill) =>
    {
      panelList.push({selectedSkill: skill, iconList: this.RandomizeSkillIcon()});
    });
    return panelList;
  }

  private RandomizeRarity(disabledRarity: SkillRarity[]): SkillRarity
  {
    let filteredWeights = new Map<SkillRarity, number>();
    let totalWeight = 0;

    // Filter out disabled rarities from RandomBaseWeights and calculate total weight of remaining rarities
    if(disabledRarity)
    {
      for(const rarity of Array.from(RandomBaseWeights.keys()))
      {
        if(!disabledRarity.includes(rarity))
        {
          filteredWeights.set(rarity, RandomBaseWeights.get(rarity)!);
          totalWeight += RandomBaseWeights.get(rarity)!;
        }
      }
    }
    else 
    { // No filler rarities
      filteredWeights = RandomBaseWeights;
      totalWeight = 100; // 100% weight for all rarities
    }


    if(totalWeight === 0)
    {
      console.error('Out of skill: Total weight is 0');
      throw new Error('Total weight is 0');
    }

    // Roll based on the new weights
    const roll = Math.random() * totalWeight;
    let cumulative = 0;

    for(const rarity of Array.from(filteredWeights.keys()))
    {
      cumulative += filteredWeights.get(rarity)!;
      if(roll < cumulative)
      {
        return rarity;
      }
    }

    // Fallback (should never happen)
    console.error("Failed to select a rarity.");
    throw new Error("Failed to select a rarity.");
  }

  public RandomizeSkillIcon(): ImageSource[]
  {
    let icons = Object.values(SKILL_ICON).sort(() => 0.5 - Math.random());
    return icons.slice(0, SKILL_ICON_LIST_LENGTH - 1);
  }

  private GetRandomSkills(availableSkills: SkillData[], count: number): SkillData[]
  {
    const shuffled = availableSkills.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  public ResetSkillSelection()
  {
    this.selectedSkills = [];
    this.disabledSkillRarity = [];
    this.skillsPool = this.configManager.GetAllSkillDataArray().filter(skill => !(this.configManager.GetLockedSkillsID().includes(skill.ID)));
  }
}