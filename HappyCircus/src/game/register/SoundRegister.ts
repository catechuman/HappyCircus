
namespace game {
	export class SoundRegister extends fish.Register {
		private registSound(name: string, isMusic: boolean = false, length: number = 0, vibrate: number = 0): void {
			// fish.SoundManager.addSound(name, ResourcePath.getSoundPath(name), isMusic, length, vibrate);
		}

		public initialize(): void {
			/** 背景音乐 */
			// this.registSound(SoundType.MUSIC_MAIN, true, 32.8);

			/** 音效 */
			// this.registSound(SoundType.SOUND_ANNUAL_LUCKYBOX);
		}
	}
}