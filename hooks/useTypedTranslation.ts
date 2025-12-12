import { TranslationKeys } from "@locales/translationKeys.ts";
import {
  useTranslation as useI18nTranslation,
  UseTranslationResponse,
} from "react-i18next";

type Namespace = "translation"; // default namespace if you’re using one file

type TFunctionTyped = <K extends TranslationKeys>(
  key: K,
  options?: Record<string, unknown>
) => string;

export const useTypedTranslation = (): Omit<
  UseTranslationResponse<Namespace, undefined>,
  "t"
> & {
  t: TFunctionTyped;
} => {
  const { t, ...rest } = useI18nTranslation<Namespace>();
  return {
    t: t as TFunctionTyped,
    ...rest,
  };
};
