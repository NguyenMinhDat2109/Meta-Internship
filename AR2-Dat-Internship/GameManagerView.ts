import {Dialog} from 'Dialog';
import {DialogManager} from 'DialogManager';
import {GameManager} from 'GameManager';
import {IEventSubscription} from 'GLOBAL_UTL_Events';
import * as hz from 'horizon/core';
import {DialogExtensions, DialogResult, IDialog} from 'IDialog';
import {IDialogManager} from 'IDialogManager';
import {Instantiate} from 'Local_Instantiate';
import {ObserverHandle} from 'ObserverHandle';
import { IServiceLocator, ServiceLocator } from "ServiceLocator";
import {UI_IngameDialog} from 'UI_IngameDialog';
import {UI_LevelFailedDialog} from 'UI_LevelFailedDialog';
import {UI_Menu} from 'UI_Menu';
import {UI_ReviveDialog} from 'UI_ReviveDialog';
import {UI_ObtainedSkillsDialog, UIButtonPressEvent} from 'UI_ObtainedSkillsDialog';
import {UI_SkillSelectionDialog} from 'UI_SkillSelectionDialog';
import {Delay, WaitForOwnerShipTransfer} from 'Utilities';
import {UI_StatsCharacter} from 'UI_StatsCharacter';
import {UI_PauseDialog, UIPauseButtonPressEvent} from 'UI_PauseDialog';
import {Stats} from 'IStatsManager';
import {EnemyManager} from './EnemyManager';
import { GoldManager } from 'GoldManager';
import { CharacterManager } from "CharacterManager";

const DIALOG_ASSETS_ID = [
  '2510812645924595', // Ingame dialog
  '1415484149420787', // Menu UI
  '953298573684289', // Revive Dialog
  '1964680440607441', // Level Failed Dialog
  '1370161601104456', // Skill Selection Dialog
  '1406750996990438', // Selected Skill Dialog
  '575011055128387', // Character Stats Dialog
  '4069931319993301',// Pause Dialog
  // '653879334159971' // Ingame dialog new for fix bug missing UI
];

class GameManagerView extends hz.Component<typeof GameManagerView>
{
  static propsDefinition = {
    gameManager: {type: hz.PropTypes.Entity},
  };

  private currentPlayer: hz.Player | undefined;
  // Only this scripts accept init ! in property
  private dialogManager!: IDialogManager;
  private gameManager!: GameManager;

  private handle: ObserverHandle = new ObserverHandle();
  private _ingameUI: UI_IngameDialog | undefined;
  private get ingameUI()
  {
    if(this._ingameUI === undefined)
    {
      this._ingameUI = this.dialogManager.CreateDialog<UI_IngameDialog>(UI_IngameDialog);
      this._ingameUI.Show();
    }
    return this._ingameUI;
  }
  private set ingameUI(value: UI_IngameDialog | undefined)
  {
    this._ingameUI = value;
  }
  private characterStatsUI: UI_StatsCharacter | undefined;
  private isShowCharacterStatsUI: boolean = false;
  private initialized: boolean = false;
  private reviveCount: number = 0;
  private eventSubscriptions: Array<IEventSubscription> = [];

  async start()
  {
    this.currentPlayer = this.entity.owner.get();
    if(this.currentPlayer == this.world.getServerPlayer()) return;
    //Temporary loading notification
    this.world.ui.showPopupForPlayer(this.currentPlayer!, 'Loading...', 30);

    if(this.props.gameManager)
    {
      await WaitForOwnerShipTransfer(this.props.gameManager!, this.currentPlayer, this);
      this.gameManager = this.props.gameManager.getComponents<GameManager>()[0];
    }
    let tcs: Array<Promise<void>> = [];
    await this.gameManager.Initialize();
    await this.InitializeDialogs();

    this.handle.AddObserver(this.gameManager.ObserverManager, {
      OnLevelCompleted: () =>
      {
        console.log('OnLevelCompleted');
        this.ShowIngameUI(false);
        this.OpenResultDialog();
      },
      OnLevelFailed: () =>
      {
        console.log('OnLevelFailed');
        this.TryToRevive();
      },
      OnWaveChanged: (wave) =>
      {
        this.ingameUI?.SetWave(wave);
      },
      OnCollectExp: (expPercent) => 
      {
        console.log('OnWaveCompleted');
        this.ingameUI?.SetExperience(expPercent);
      },
      OnCharacterLevelUp: (level, expPercent) =>
      {
        console.log('OnCharacterLevelUp');
        this.ingameUI?.SetLevel(level);
        this.ingameUI?.SetExperienceWhenLevelUp(expPercent);
        this.OpenSkillSelectionUI();
      },
       OnCollectGold: (gold) => 
      {
        console.log('OnWaveCompleted');
        this.ingameUI?.SetCoin(gold);
      }

    });

    this.handle.AddObserver(this.gameManager.waveManager, {
      OnInitialWaveBoss: () =>
      {
        this.ingameUI?.ToggleBossUI(true);
        this.ingameUI?.SetBossHpPercent(1, 1);
      },
      OnCompletedWaveBoss: () =>
      {
        this.ingameUI?.ToggleBossUI(false);
      },
    });
    //Temporary loading notification
    this.world.ui.showPopupForPlayer(this.currentPlayer!, 'Loading complete', 2);
    this.OpenMenuUI();

    // this.OpenSkillSelectionUI();
  }

  private TryToRevive()
  {
    // Revive count is 1, show level failed dialog
    console.log('TryToRevive');
    if(this.reviveCount == 1)
    {
      this.OpenResultDialog();
      return;
    }
    this.OpenReviveDialog();
  }

  private async OpenReviveDialog()
  {
    console.log('OpenReviveDialog');
    let reviveDialog = this.dialogManager.CreateDialog<UI_ReviveDialog>(UI_ReviveDialog);
    await reviveDialog.Show();
    let result = await DialogExtensions.GetResult(reviveDialog);
    switch(result)
    {
      case DialogResult.Buy:
        // TODO: Buy revive
        this.reviveCount++;
        this.gameManager.Revive();
        break;
      case DialogResult.Close:
        this.OpenResultDialog();
        break;
      default: break;
    }
    this.dialogManager.HideDialog(reviveDialog);
  }

  private async OpenResultDialog()
  {
    console.log('OpenLevelFailedDialog');
    let resultDialog = this.dialogManager.CreateDialog<UI_LevelFailedDialog>(UI_LevelFailedDialog);
    resultDialog.SetWave(this.gameManager.waveManager.currentWave);
    resultDialog.Show();
    this.ingameUI?.ToggleBossUI(false);
    this.EnableSkillButtonPressEvent(false);
    this.EnablePauseButtonPressEvent(false);
    let result = await DialogExtensions.GetResult(resultDialog);
    this.dialogManager.HideDialog(resultDialog);
    switch(result)
    {
      case DialogResult.Close:
        this.ShowIngameUI(false);
        this.gameManager.OnReset();
        await Delay(this, 2); // Delay 2 seconds to show the dialog for feeling
        this.OpenMenuUI();
        break;
      case DialogResult.Restart:
        // TODO: Restart level
        break;
      default: break;
    }
  }

  private async OpenMenuUI()
  { 
    let menuDialog = this.dialogManager.CreateDialog<UI_Menu>(UI_Menu);
    menuDialog.Show();
    let result = await DialogExtensions.GetResult(menuDialog);
    this.dialogManager.HideDialog(menuDialog);
    
    switch(result)
    {
      case DialogResult.Play:
        this.reviveCount = 0;
        this.ShowIngameUI(true);
        this.gameManager.levelManager?.ResetText();
        this.gameManager.skillSelectionManager?.ResetSkillSelection();
        this.ingameUI?.ResetLevel();
        console.log('OpenMenuUI');
        if (this.currentPlayer) {

          this.ingameUI?.SetCoin(GoldManager.GetGold(this.currentPlayer));
        }
        this.EnableSkillButtonPressEvent(true);
        this.EnablePauseButtonPressEvent(true);
        this.gameManager.LoadLevel();
        break;
      default: break;
    }
  }

  private async ShowIngameUI(enable: boolean)
  {
    this.ingameUI?.entity.visible.set(enable);
  }

  private async OpenSkillSelectionUI()
  {
    let skillSelectionUI = this.dialogManager.CreateDialog<UI_SkillSelectionDialog>(UI_SkillSelectionDialog);
    this.gameManager.isPaused = true;
    skillSelectionUI.SetSkillPanelList(this.gameManager.skillSelectionManager!.RandomizeSkillSelection());
    this.ShowIngameUI(false);
    this.ShowCharacterStatUI(false, false);
    skillSelectionUI.Show();
    skillSelectionUI.StartIconAnimation();
    let result = await DialogExtensions.GetResult(skillSelectionUI);
    this.dialogManager.HideDialog(skillSelectionUI);
    switch(result)
    {
      case DialogResult.Close:
        if(!skillSelectionUI.selectedSkill)
        {
          console.error('Skill selected is undefind');
          return;
        }
        this.gameManager.skillSelectionManager?.OnGetSelectedSkill(skillSelectionUI.selectedSkill);
        this.gameManager.levelManager?.DispatchEvent((observer) => observer.OnCompletedLevelUpProcess?.());
        this.gameManager.isPaused = false;
        this.ShowIngameUI(true);
        break;
      default: break;
    }
  }

  private async OpenSelectedSkillUI(isPause: boolean)
  {
    if(isPause)
    {
      this.gameManager.isPaused = true;
    }
    let selectedSkillUI = this.dialogManager.CreateDialog<UI_ObtainedSkillsDialog>(UI_ObtainedSkillsDialog);
    selectedSkillUI.SetObtainedSkillBinding(this.gameManager.skillSelectionManager?.GetSelectedSkills()!);
    selectedSkillUI.Show();
    let result = await DialogExtensions.GetResult(selectedSkillUI);
    this.dialogManager.HideDialog(selectedSkillUI);

    if(this.ingameUI)
    {
      this.ingameUI.isSkillButtonClicked = false;
    }
    switch(result)
    {
      case DialogResult.Close:
        if(isPause)
        {
          this.gameManager.isPaused = false;
        }
        break;
      default: break;
    }
  }

  private async OpenPauseUI(isPause: boolean)
  {
    if(isPause)
    {
      this.gameManager.isPaused = true;
    }
    let pauseUI = this.dialogManager.CreateDialog<UI_PauseDialog>(UI_PauseDialog);
    console.log(pauseUI);
    pauseUI.SetObtainedSkillBinding(this.gameManager.skillSelectionManager?.GetSelectedSkills()!);
    pauseUI.Show();
    let result = await DialogExtensions.GetResult(pauseUI);
    this.dialogManager.HideDialog(pauseUI);

    if(this.ingameUI)
    {
      this.ingameUI.isPauseButtonClicked = false;
    }
    switch(result)
    {
      case DialogResult.Close:
        if(isPause)
        {
          this.gameManager.isPaused = false;
        }
        break;
      default: break;
    }
  }

  private async ShowCharacterStatUI(isShow: boolean, canPause: boolean)
  {
    if(canPause)
    {
      this.gameManager.isPaused = isShow;
    }

    if(isShow)
    {
      this.characterStatsUI = this.dialogManager.CreateDialog(UI_StatsCharacter);
      this.characterStatsUI.SetCharacterManager(this.gameManager.characterManager);
      this.characterStatsUI.Show();
    } else
    {
      if(this.isShowCharacterStatsUI)
      {
        this.characterStatsUI?.Hide();
      }
    }
    this.isShowCharacterStatsUI = isShow;

  }

  private EnableSkillButtonPressEvent(enable: boolean)
  {
    if(enable)
    {
      this.eventSubscriptions.push(
        UIButtonPressEvent.OnSkillButtonPressed.AddListener(async (isPause) =>
        {
          await this.OpenSelectedSkillUI(isPause);
        }));
      this.eventSubscriptions.push(
        UIButtonPressEvent.OnCharacterStatsButtonPressed.AddListener(async (isShow) =>
        {
          this.ShowCharacterStatUI(isShow, true);
        })
      );
      return;
    }
    for(const event of this.eventSubscriptions)
    {
      event.Disconnect();
    }
    this.eventSubscriptions = [];
  }
  private EnablePauseButtonPressEvent(enable: boolean)
  {
    if(enable)
    {
      this.eventSubscriptions.push(
        UIPauseButtonPressEvent.OnPauseButtonPressed.AddListener(async (isPause) =>
        {
          await this.OpenPauseUI(isPause);
        }));
      return;
    }
    for(const event of this.eventSubscriptions)
    {
      event.Disconnect();
    }
    this.eventSubscriptions = [];
  }

  private async InitializeDialog(instantiate: Instantiate, assetID: string): Promise<IDialog>
  {
    let entity = await instantiate.CreateEntity(assetID);
    if(!entity)
    {
      throw new Error(`Can not create dialog with ID = ${assetID}`);
    }
    return entity.getComponents<Dialog>()[0];
  }

  private async InitializeDialogs()
  {
    if(this.initialized) {return;}// already initialized;
    this.initialized = true;
    let instantiate = new Instantiate(this);
    let completionPromise: Array<Promise<IDialog>> = [];

    let dialogs: Array<IDialog> = [];

    for(const id of DIALOG_ASSETS_ID)
    {
      let dialogPromise = this.InitializeDialog(instantiate, id);
      completionPromise.push(dialogPromise);
      const dialog = await dialogPromise;
      dialogs.push(dialog);
    }

    await Promise.all(completionPromise);

    ServiceLocator.Instance.RegisterService(DialogManager, 'DialogManager');
    this.dialogManager = new DialogManager(dialogs);
    ServiceLocator.Instance.Provide(DialogManager, this.dialogManager);

  }
}
hz.Component.register(GameManagerView);