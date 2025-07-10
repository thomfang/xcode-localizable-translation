import { Script } from "scripting"
import { findKeysToTranslate, LocalizableData, mergeTranslations } from "./xcstrings_util"
import { translate } from "./translate"
import { getTranslationSourceFromClipboard } from "./util"

type Language = {
  locale: string
  name: string
}

const languages: Language[] = [
  { locale: "zh-Hans", name: "简体中文" },
  { locale: "zh-Hant", name: "繁體中文" },
  { locale: "ja", name: "日本語" },
  { locale: "ko", name: "한국어" },
  { locale: "fr", name: "Français" },
  { locale: "de", name: "Deutsch" },
  { locale: "es", name: "Español" },
  { locale: "en-GB", name: "English (United Kingdom)" },
  { locale: "it", name: "Italiano" },
  { locale: "ru", name: "Русский" },
  { locale: "pt", name: "Português" },
  // { locale: "ar", name: "العربية" },
  // { locale: "hi", name: "हिन्दी" },
]

async function translateForLanguage(
  {
    locale, name
  }: Language,
  data: LocalizableData,
) {
  const language = `${name} (${locale})`

  try {

    let contents = findKeysToTranslate(
      data,
      locale
    )
    let total = contents.length

    if (total === 0) {
      console.log(`[${language}] No content to translate.`)
      return
    }

    console.log(`[${language}] ${contents.length} key(s) to translate`)

    let count = 0
    let translations: Record<string, string> = {}

    while (contents.length) {
      let list = contents.splice(0, 100)

      console.log(`[${language}] Processing ${list.length} key(s)...`)

      let map = await translate(
        list,
        language
      )

      count += list.length

      if (!map) {
        console.error(`[${language}] Failed to translate`)
        continue
      }

      translations = {
        ...translations,
        ...map
      }

      console.log(`[${language}] Progress: ${(count / total * 100) | 0}%`)
    }

    if (Object.keys(translations).length === 0) {
      console.error(`[${language}] Failed to translate.`)
    } else {
      console.log(`[${language}] Merging new translations...`)

      mergeTranslations(
        data,
        translations,
        locale
      )
    }

  } catch (e) {
    console.error(e)
  }
}

async function run() {

  console.present().then(() => {
    Script.exit()
  })

  const data = await getTranslationSourceFromClipboard()

  if (!data) {
    return
  }

  for (const language of languages) {
    await translateForLanguage(language, data)
  }

  const result = JSON.stringify(
    data, null, 2
  )

  await Clipboard.copyText(result)

  console.log("The result has been copied to pasteboard.")
}

run()