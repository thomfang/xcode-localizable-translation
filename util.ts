import { LocalizableData } from "./xcstrings_util"

export async function getTranslationSourceFromClipboard() {
  try {
    const content = await Clipboard.getText()
    if (!content) {
      console.error("No content found.")
      return
    }
    console.log("Try to parse pasted content to JSON")
    const data = await JSON.parse(
      content
    ) as LocalizableData
    console.log(
      content
        .split("\n")
        .slice(8)
        .join("\n"),
      "..."
    )
    if (await Dialog.confirm({
      message: "Do you want to translate this content?"
    })) {
      return data
    }
  } catch (e) {
    console.error("Failed to parse data", e)
  }
}