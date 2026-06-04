/**
 * Minimal i18n. Follows the system language: Chinese -> zh, otherwise en.
 */

type Dict = {
  navTitle: string
  close: string
  // status
  statusSection: string
  currentStatus: string
  phaseIdle: string
  phaseReady: string
  phaseRunning: string
  phasePaused: string
  phaseCompleted: string
  phaseCancelled: string
  phaseError: string
  progressCount: (done: number, total: number, pct: number) => string
  failedCount: (n: number) => string
  idleHint: string
  // input
  inputSection: string
  pasteFromClipboard: string
  repasteFromClipboard: string
  loadedEntries: (n: number) => string
  // settings
  modelSection: string
  provider: string
  customGroup: string
  builtInGroup: string
  model: string
  loadingProviders: string
  performanceSection: string
  performanceFooter: string
  requestInterval: (ms: number) => string
  concurrency: (n: number) => string
  batchSize: (n: number) => string
  runtimeSection: string
  runtimeFooter: string
  keepScreenOn: string
  keepAlive: string
  // languages
  targetLanguages: string
  selectedAll: string
  selectedCount: (n: number) => string
  targetLangFooter: string
  // progress
  languageProgress: string
  localePending: string
  localeRunning: string
  localeCompleted: string
  localePartial: (failed: number) => string
  // actions
  actionsSection: string
  start: string
  pause: string
  resume: string
  cancel: string
  copyResult: string
  exportFile: string
  // logs
  logsSection: string
  // log messages
  logParseFailed: string
  logRecognized: (n: number) => string
  logNoProvider: string
  logCancelled: string
  logCompleted: string
  logError: (e: unknown) => string
  logPaused: string
  logResumed: string
  logCancelling: string
  logCopied: string
  logExported: string
  logExportFailed: string
  // runner messages
  runNothing: string
  runTotalBatches: (count: number, concurrency: number, intervalMs: number) => string
  runBatchProcessing: (language: string, n: number) => string
  runBatchFailed: (language: string) => string
  runBatchError: (language: string, e: unknown) => string
}

const zh: Dict = {
  navTitle: "Xcstrings 翻译",
  close: "关闭",
  statusSection: "状态",
  currentStatus: "当前状态",
  phaseIdle: "等待粘贴",
  phaseReady: "就绪",
  phaseRunning: "翻译中",
  phasePaused: "已暂停",
  phaseCompleted: "已完成",
  phaseCancelled: "已取消",
  phaseError: "出错",
  progressCount: (done, total, pct) => `${done} / ${total} （${pct}%）`,
  failedCount: n => `失败 ${n}`,
  idleHint: "请先从剪贴板粘贴 Localizable.xcstrings 内容。",
  inputSection: "输入",
  pasteFromClipboard: "从剪贴板粘贴",
  repasteFromClipboard: "重新从剪贴板粘贴",
  loadedEntries: n => `已加载 ${n} 个条目`,
  modelSection: "AI 模型",
  provider: "Provider",
  customGroup: "自定义",
  builtInGroup: "内置",
  model: "模型",
  loadingProviders: "正在加载 Provider...",
  performanceSection: "性能参数",
  performanceFooter: "间隔越大越稳、越小越快，部分模型有速率限制；并发与每批条数越大越快，但可能触发限流或导致响应过长。",
  requestInterval: ms => `请求间隔：${ms} ms`,
  concurrency: n => `并发数：${n}`,
  batchSize: n => `每批条数：${n}`,
  runtimeSection: "运行选项",
  runtimeFooter: "翻译期间建议开启，避免锁屏或切到后台时任务被系统中断。",
  keepScreenOn: "保持屏幕常亮",
  keepAlive: "后台保活",
  targetLanguages: "目标语言",
  selectedAll: "全部",
  selectedCount: n => `${n} 项`,
  targetLangFooter: "至少选择一种语言。",
  languageProgress: "语言进度",
  localePending: "等待中",
  localeRunning: "翻译中",
  localeCompleted: "完成",
  localePartial: failed => `部分失败 (${failed})`,
  actionsSection: "操作",
  start: "开始翻译",
  pause: "暂停",
  resume: "继续",
  cancel: "取消",
  copyResult: "复制结果",
  exportFile: "导出为文件",
  logsSection: "日志",
  logParseFailed: "剪贴板内容无法解析为 Localizable.xcstrings。",
  logRecognized: n => `已识别 ${n} 个字符串条目。`,
  logNoProvider: "未选择有效的 Provider。",
  logCancelled: "已取消翻译。",
  logCompleted: "翻译完成。",
  logError: e => `翻译出错: ${e}`,
  logPaused: "已暂停（将在当前批次完成后停止发起新请求）。",
  logResumed: "已继续。",
  logCancelling: "正在取消...",
  logCopied: "结果已复制到剪贴板。",
  logExported: "已导出文件。",
  logExportFailed: "导出已取消或失败。",
  runNothing: "没有需要翻译的内容。",
  runTotalBatches: (count, concurrency, intervalMs) =>
    `共 ${count} 个批次待处理（并发 ${concurrency}，间隔 ${intervalMs}ms）。`,
  runBatchProcessing: (language, n) => `[${language}] 翻译 ${n} 条...`,
  runBatchFailed: language => `[${language}] 该批次翻译失败。`,
  runBatchError: (language, e) => `[${language}] 出错: ${e}`,
}

const en: Dict = {
  navTitle: "Xcstrings Translation",
  close: "Close",
  statusSection: "Status",
  currentStatus: "Status",
  phaseIdle: "Waiting",
  phaseReady: "Ready",
  phaseRunning: "Translating",
  phasePaused: "Paused",
  phaseCompleted: "Completed",
  phaseCancelled: "Cancelled",
  phaseError: "Error",
  progressCount: (done, total, pct) => `${done} / ${total} (${pct}%)`,
  failedCount: n => `${n} failed`,
  idleHint: "Paste Localizable.xcstrings content from the clipboard to begin.",
  inputSection: "Input",
  pasteFromClipboard: "Paste from Clipboard",
  repasteFromClipboard: "Re-paste from Clipboard",
  loadedEntries: n => `${n} entries loaded`,
  modelSection: "AI Model",
  provider: "Provider",
  customGroup: "Custom",
  builtInGroup: "Built-in",
  model: "Model",
  loadingProviders: "Loading providers...",
  performanceSection: "Performance",
  performanceFooter: "Larger interval is steadier, smaller is faster (some models are rate-limited); higher concurrency and batch size are faster but may trigger throttling or overlong responses.",
  requestInterval: ms => `Interval: ${ms} ms`,
  concurrency: n => `Concurrency: ${n}`,
  batchSize: n => `Items per batch: ${n}`,
  runtimeSection: "Runtime Options",
  runtimeFooter: "Recommended during translation to avoid interruption when the screen locks or the app goes to the background.",
  keepScreenOn: "Keep Screen On",
  keepAlive: "Background Keep-Alive",
  targetLanguages: "Target Languages",
  selectedAll: "All",
  selectedCount: n => `${n} selected`,
  targetLangFooter: "Select at least one language.",
  languageProgress: "Language Progress",
  localePending: "Pending",
  localeRunning: "Translating",
  localeCompleted: "Done",
  localePartial: failed => `Partial fail (${failed})`,
  actionsSection: "Actions",
  start: "Start",
  pause: "Pause",
  resume: "Resume",
  cancel: "Cancel",
  copyResult: "Copy Result",
  exportFile: "Export File",
  logsSection: "Logs",
  logParseFailed: "Clipboard content can't be parsed as Localizable.xcstrings.",
  logRecognized: n => `Recognized ${n} string entries.`,
  logNoProvider: "No valid provider selected.",
  logCancelled: "Translation cancelled.",
  logCompleted: "Translation completed.",
  logError: e => `Translation error: ${e}`,
  logPaused: "Paused (will stop after the current batch finishes).",
  logResumed: "Resumed.",
  logCancelling: "Cancelling...",
  logCopied: "Result copied to clipboard.",
  logExported: "File exported.",
  logExportFailed: "Export cancelled or failed.",
  runNothing: "Nothing to translate.",
  runTotalBatches: (count, concurrency, intervalMs) =>
    `${count} batch(es) to process (concurrency ${concurrency}, interval ${intervalMs}ms).`,
  runBatchProcessing: (language, n) => `[${language}] translating ${n} item(s)...`,
  runBatchFailed: language => `[${language}] batch failed.`,
  runBatchError: (language, e) => `[${language}] error: ${e}`,
}

function detectLang(): "zh" | "en" {
  try {
    return Device.systemLanguageCode === "zh" ? "zh" : "en"
  } catch {
    return "en"
  }
}

export const t: Dict = detectLang() === "zh" ? zh : en
