import {IDialog} from "IDialog";

export type OnButtonClicked = (dialog: IDialog, param1: string, param2: string) => void;
export type OnDialogWillShow = (dialog: IDialog, param: string) => void;
export type OnDialogDidHide = (dialog: IDialog, param: string) => void;

export class DialogManagerObserver
{
  /**
   * Occurs when a button is clicked.
   */
  public OnButtonClicked?: OnButtonClicked;

  /**
   * Occurs when a dialog is about to show.
   */
  public OnDialogWillShow?: OnDialogWillShow;

  /**
   * Occurs when a dialog finishes hiding.
   */
  public OnDialogDidHide?: OnDialogDidHide;
}

export interface IDialogManager
{
  CreateDialog<U extends IDialog>(type: new (...args: any[]) => U): U;
  HideDialog(dialog: IDialog): void;
}

export namespace DialogManagerExtensions
{
  /**
   * Creates the specified dialog.
   */
  export function CreateDialog<T extends IDialog>(manager: IDialogManager, type: new () => T): T
  {
    return manager.CreateDialog(type) as T;
  }
}

