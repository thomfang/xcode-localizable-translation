import { LocalizableData } from "./xcstrings_util"

/**
 * Try to parse the clipboard content as a Localizable.xcstrings JSON.
 * Returns the parsed data or null (no dialog — UI decides what to do).
 */
export async function parseClipboardSource(): Promise<LocalizableData | null> {
  try {
    const content = await Clipboard.getText()
    if (!content) {
      return null
    }
    const data = JSON.parse(content) as LocalizableData
    if (!data || typeof data !== "object" || data.strings == null) {
      return null
    }
    return data
  } catch (e) {
    console.error("Failed to parse clipboard data", e)
    return null
  }
}

/** Serialize the localizable data for output. */
export function serializeResult(data: LocalizableData): string {
  return JSON.stringify(data, null, 2)
}

/** Export the result as a Localizable.xcstrings file via the document picker. */
export async function exportResult(
  data: LocalizableData,
  fileName = "Localizable.xcstrings",
): Promise<boolean> {
  try {
    const json = serializeResult(data)
    const fileData = Data.fromString(json)
    if (!fileData) {
      return false
    }
    const result = await DocumentPicker.exportFiles({
      files: [{ data: fileData, name: fileName }],
    })
    return result.length > 0
  } catch (e) {
    console.error("Failed to export file", e)
    return false
  }
}
