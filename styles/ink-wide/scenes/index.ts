// Scene registry: story.json → beats[].scene must be one of these keys.
import { SceneDef } from "../theme";
import { wAiYou, wCodeCheap, wWhatMatters } from "./claim";
import { wBotAttack, wMissingPiece, wOmidBrief, wPhoneRings, wTestsGreen, wWeekendBuild } from "./omid";
import { wAgentAnswers, wHalfHour, wThreeQuestions } from "./lesson";
import { wKitchenCrew, wWiseChef, wWrongSpice } from "./kitchen";
import { wModernTitle, wStepPlan, wStepSensitive, wStepSpec, wStepSplit, wStepTests } from "./checklist";
import { wFollow } from "./finale";

export const SCENES: Record<string, SceneDef> = {
  "w-code-cheap": wCodeCheap,
  "w-what-matters": wWhatMatters,
  "w-ai-you": wAiYou,
  "w-omid-brief": wOmidBrief,
  "w-weekend-build": wWeekendBuild,
  "w-phone-rings": wPhoneRings,
  "w-bot-attack": wBotAttack,
  "w-tests-green": wTestsGreen,
  "w-missing-piece": wMissingPiece,
  "w-half-hour": wHalfHour,
  "w-three-questions": wThreeQuestions,
  "w-agent-answers": wAgentAnswers,
  "w-kitchen-crew": wKitchenCrew,
  "w-wrong-spice": wWrongSpice,
  "w-wise-chef": wWiseChef,
  "w-modern-title": wModernTitle,
  "w-step-spec": wStepSpec,
  "w-step-plan": wStepPlan,
  "w-step-split": wStepSplit,
  "w-step-tests": wStepTests,
  "w-step-sensitive": wStepSensitive,
  "w-follow": wFollow,
};