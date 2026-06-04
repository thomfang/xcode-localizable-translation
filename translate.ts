/**
 * Translation request layer.
 *
 * Throttling and concurrency are handled by the scheduler — this module only
 * performs a single structured-data request (with internal retry on malformed
 * responses) and supports cooperative cancellation.
 */

export type ProviderSelection = {
  provider: Assistant.Provider
  modelId?: string
}

export type TranslateSignal = {
  readonly isCancelled: boolean
}

const schema: JSONSchemaObject = {
  type: "object",
  properties: {
    translations: {
      required: true,
      type: "array",
      items: {
        type: "string",
        description: "Translated content",
        required: true,
      },
      description: "Translated contents array in the same order as input",
    },
  },
  description: "The translated contents json object",
}

function buildPrompt(contents: string[], language: string): string {
  return `以下是Scripting iOS app的 Localizable.xcstrings 文件里的需要翻译的文案，每个<content>标签为一条文案，请将它们翻译为${language}，请遵循以下几点规则：
  1.保留文案中的变量
  2.Scripting指Scripting App，不要翻译为"脚本"
  3.Assistant指Scripting Assistant，中文是"智能助手"的意思，按这个意思翻译
  4.Scripting App是一个可以在iOS设备上编写脚本的app，翻译的内容需要专业和准确

  文案内容:\n
  ${contents.map(item => `<content>${item}</content>`).join("\n")}`
}

/**
 * Translate a batch of contents into `language`.
 * Returns a map of source -> translation, or null on failure / cancellation.
 */
export async function translate(
  contents: string[],
  language: string,
  selection: ProviderSelection,
  signal?: TranslateSignal,
  retry = 0,
): Promise<Record<string, string> | null> {
  if (signal?.isCancelled) {
    return null
  }

  const prompt = buildPrompt(contents, language)

  try {
    const res = await Assistant.requestStructuredData<{
      translations: string[]
    }>(
      prompt,
      schema,
      {
        provider: selection.provider,
        modelId: selection.modelId,
      },
    )

    if (signal?.isCancelled) {
      return null
    }

    if (res.translations.length !== contents.length) {
      if (++retry <= 3) {
        console.error(`[${language}] Invalid translated results, retrying... ${retry}`)
        return translate(contents, language, selection, signal, retry)
      }
      // Surface the mismatch instead of silently dropping the batch.
      throw new Error(
        `model returned ${res.translations.length} translations, expected ${contents.length}`,
      )
    }

    const map: Record<string, string> = {}
    contents.forEach((key, i) => {
      map[key] = res.translations[i]
    })
    return map
  } catch (e) {
    if (signal?.isCancelled) {
      return null
    }
    console.error(`[${language}] ${e}`)

    if (++retry <= 3) {
      console.error(`[${language}] Retrying... ${retry}`)
      return translate(contents, language, selection, signal, retry)
    }

    // Retries exhausted: propagate the real error so it reaches the UI log.
    throw e
  }
}
