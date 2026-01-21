import type { ChallengeFileInput, SubplebbitChallengeSetting } from "@plebbit/plebbit-js/dist/node/subplebbit/types.js";
/**
 * Challenge file factory function
 */
declare function ChallengeFileFactory({ challengeSettings }: {
    challengeSettings: SubplebbitChallengeSetting;
}): ChallengeFileInput;
export default ChallengeFileFactory;
