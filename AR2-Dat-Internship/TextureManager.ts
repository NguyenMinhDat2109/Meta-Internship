import { TextureAsset } from 'horizon/core';
import { ImageSource } from 'horizon/ui';
import {SKILL_ICON} from 'Skill_Const';

export class TextureManager {
  static propsDefinition = {};
  static assetIdPools: Map<string, ImageSource> = new Map<string, ImageSource>;

  static GetTextureAsset(id: string): ImageSource {
    if (this.assetIdPools.has(id)) {
      return this.assetIdPools.get(id)!;
    }

    let textureAsset = ImageSource.fromTextureAsset(new TextureAsset(BigInt(id)));
    this.assetIdPools.set(id, textureAsset);
    return textureAsset;
  }
}