let schema: JSONSchemaObject = {
  type: "object",
  properties: {
    translations: {
      required: true,
      type: "array",
      items: {
        type: "string",
        description: "Translated content",
        required: true
      },
      description: "Translated contents array in the same order as input"
    }
  },
  description: "The translated contents json object",
}

let firstRequest = true

async function wait(seconds: number) {
  console.log("Waiting for", seconds, "seconds...")
  await new Promise<void>(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}

export async function translate(
  contents: string[],
  language: string,
  retry = 0
) {
  // const prompt = `以下是Scripting iOS app的 Localizable.xcstrings 文件里的需要翻译的文案，每个<content>标签为一条文案，请将它们翻译为${language}，请遵循以下几点规则：
  // 1.保留文案中的变量
  // 2.Scripting指Scripting App，不要翻译为"脚本"
  // 3.Scripting App是一个可以在iOS设备上编写脚本的app，翻译的内容需要专业和准确
  
  // 文案内容:\n
  // ${contents.map(item => `<content>${item}</content>`).join("\n")}`

  const prompt = `The following are the contents that need to be translated in the Localizable.xcstrings file of the Scripting iOS app. Each <content> tag represents a piece of text. Please translate them into ${language}, following these rules:
  1. Keep the variables in the text.
  2. "Scripting" refers to the Scripting App, do not translate it as "script".
  3. The Scripting App is an app that allows users to write scripts on iOS devices, so the translations need to be professional and accurate.

  Content:\n
  ${contents.map(item => `<content>${item}</content>`).join("\n")}`

  if (firstRequest) {
    firstRequest = false
  } else {
    // Wait for 5 seconds, avoid api rate limit
    await wait(5)
  }

  try {
    let res = await Assistant
      .requestStructuredData<{
        translations: string[]
      }>(
        prompt,
        schema
      )

    console.log(`[${language}] Response:`, res)

    if (res.translations.length != contents.length) {
      if (++retry <= 3) {
        console.error("Invalid translated results, retrying...", retry)
        return translate(
          contents,
          language,
          retry
        )
      }
      return null
    }
    const map: Record<string, string> = {}
    contents.forEach((key, i) => {
      map[key] = res.translations[i]
    })
    return map
  } catch (e) {
    console.error(`[${language}] ${e}`)

    if (++retry <= 3) {
      console.error(`[${language}] Retrying... ${retry}`)
      return translate(
        contents,
        language,
        retry
      )
    }

    return null
  }
}