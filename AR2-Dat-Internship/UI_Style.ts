import * as hz from 'horizon/core';
import {TextStyle, ViewStyle} from 'horizon/ui';

export class UI_Style
{
  public static Background: ViewStyle = {
    width: '100',
    height: '100',
    position: 'absolute',
  }

  public static TextShadow: TextStyle = {
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: [2, 2],
  }

  public static TextAligntCenter: TextStyle = {
    textAlign: 'center',
    textAlignVertical: 'center',
  }

  public static ChildrenAlignCenter: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  }
}
