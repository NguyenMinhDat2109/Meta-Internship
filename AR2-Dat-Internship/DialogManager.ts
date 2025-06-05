import {IArrayCache, ArrayCache} from "IArrayCache";
import {IDialog} from "IDialog";
import {DialogManagerObserver, IDialogManager} from "IDialogManager";
import {ObserverManager} from "IObserverManager";

export class DialogManager extends ObserverManager<DialogManagerObserver> implements IDialogManager
{
  private readonly dialogs: IArrayCache<IDialog> = new ArrayCache();

  constructor(dialogs: Array<IDialog>)
  {
    super();
    dialogs.forEach((e) =>
    {
      this.dialogs.AddItem(e);
    })
  }

  CreateDialog<U extends IDialog>(type: new (...args: any[]) => U): U
  {
    let items = this.dialogs.GetItems(type);
    if(items.length == 0)
    {
      console.error(`Don't have item type: ${type} in activate list`);
      throw new Error(`Don't have item type: ${type} in activate list`);
    }
    return items[0];
  }

  HideDialog(dialog: IDialog)
  {
    this.dialogs.AddItem(dialog);
  }
}
