import {DialogWithResult} from 'Dialog';
import {UINode} from 'horizon/ui';
import {IObserverManager} from 'IObserverManager';
import {ObserverHandle} from 'ObserverHandle';

export enum DialogResult
{
  /**
   * Close the current dialog.
   */
  Close,

  /**
   * Play the selected level.
   */
  Play,

  /**
   * Continue the current level..
   */
  Continue,
  /**
   * Go to the next level.
   */

  Next,
  /**
   * Restart the current level.
   */

  Restart,

  /**
   * Go back to the previous UI.
   */
  Back,

  /**
   * Spend currency.
   */
  Buy,

  /**
   * Time-out.
   */
  TimeOut,
}

export class DialogObserver
{
  OnWillShow?: () => void;
  OnDidShow?: () => void;
  OnWillHide?: () => void;
  OnDidHide?: () => void;
}

export interface IDialog extends IObserverManager<DialogObserver>
{
  /**
   * Checks whether this dialog is active.
   */
  isActive: Readonly<boolean>;

  Content(): UINode;

  /**
   * Gets or sets the show transition factory.
   */
  ShowTransitionFactory?: () => Promise<void>;

  /**
   * Gets or sets the hide transition factory.
   */
  HideTransitionFactory?: () => Promise<void>;

  /**
   * Shows this dialog.
   */
  Show(): Promise<void>;

  /**
   * Hides this dialog.
   */
  Hide(): Promise<void>;
}

export interface IDialogWithResult<T> extends IDialog
{
  /**
   * Gets the result of this dialog.
   */
  Result: Readonly<T>;

  /**
   * Hides this dialog with a result.
   */
  HideWithResult(result: T): Promise<void>;
}

export class DialogExtensions
{
  /**
 * Waits until the specified dialog is hidden.
 */
  public static async Wait(dialog: IDialog): Promise<void>
  {
    const handle = new ObserverHandle();
    const completionPromise = new Promise<void>((resolve) =>
    {
      handle.AddObserver(dialog, {
        OnDidHide: () =>
        {
          resolve()
          handle.Dispose();
        },
      });
    });
    await completionPromise;
  }

  /**
   * Gets the dialog result.
   */
  public static async GetResult<T>(dialog: DialogWithResult<T>): Promise<T>
  {
    await this.Wait(dialog);
    return dialog.Result;
  }
}
