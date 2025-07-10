export type LocalizableStrings = {
  [key: string]: {
    localizations?: {
      [locale: string]: {
        stringUnit: {
          state: string
          value: string
        }
      }
    }
    shouldTranslate?: boolean
    extractionState?: string
  }
}

export type LocalizableData = {
  sourceLanguage: string
  strings: LocalizableStrings
  version: string
}

export const readLocalizableData = async (
  filePath: string
): Promise<LocalizableData | null> => {
  try {
    let content = await FileManager.readAsString(
      filePath
    )
    const data: LocalizableData = JSON.parse(
      content
    )
    return data
  } catch (e) {
    console.error("Error parsing JSON:", e)
    return null
  }
}

export const findKeysToTranslate = (
  data: LocalizableData,
  locale: string
): string[] => {
  const keysToTranslate: string[] = []

  for (const key in data.strings) {
    if (key === "") {
      continue
    }
    const stringEntry = data.strings[key]
    if (stringEntry.shouldTranslate !== false
      && stringEntry.localizations?.[locale] == null
    ) {
      keysToTranslate.push(key)
    }
  }

  return keysToTranslate
}

export const mergeTranslations = (
  data: LocalizableData,
  translationMap: Record<string, string>,
  locale: string
) => {
  Object
    .entries(translationMap)
    .forEach(([key, content]) => {
      let info = data.strings[key]
      if (info.shouldTranslate === false) {
        return
      }

      if (info.localizations == null) {
        info.localizations = {}
      }

      info.localizations[locale] = {
        stringUnit: {
          state: "translated",
          value: content
        }
      }
    })
}