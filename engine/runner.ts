import { LocalizableData, findKeysToTranslate, mergeTranslations } from "../xcstrings_util"
import { translate, ProviderSelection } from "../translate"
import { Language } from "../languages"
import { runTasks, SchedulerController } from "./scheduler"
import { t } from "../i18n"

const DEFAULT_BATCH_SIZE = 30

export type LocaleProgress = {
  locale: string
  name: string
  total: number
  done: number
  failed: number
  status: "pending" | "running" | "completed" | "partial"
}

type TaskUnit = {
  locale: string
  language: string
  contents: string[]
}

export type RunnerCallbacks = {
  onLog: (message: string) => void
  onProgress: (progress: Record<string, LocaleProgress>) => void
}

export type RunnerOptions = {
  data: LocalizableData
  languages: Language[]
  selection: ProviderSelection
  concurrency: number
  intervalMs: number
  controller: SchedulerController
  callbacks: RunnerCallbacks
  /** Number of items per translation request. Defaults to 30. */
  batchSize?: number
}

/**
 * Build per-language batches and run them through the scheduler.
 * Mutates `data` in place via mergeTranslations. Returns final progress.
 */
export async function runTranslation(
  options: RunnerOptions,
): Promise<Record<string, LocaleProgress>> {
  const { data, languages, selection, concurrency, intervalMs, controller, callbacks } = options
  const batchSize = Math.max(1, Math.floor(options.batchSize ?? DEFAULT_BATCH_SIZE))

  const progress: Record<string, LocaleProgress> = {}
  const tasks: TaskUnit[] = []

  for (const lang of languages) {
    const keys = findKeysToTranslate(data, lang.locale)
    progress[lang.locale] = {
      locale: lang.locale,
      name: lang.name,
      total: keys.length,
      done: 0,
      failed: 0,
      status: keys.length === 0 ? "completed" : "pending",
    }
    const language = `${lang.name} (${lang.locale})`
    for (let i = 0; i < keys.length; i += batchSize) {
      tasks.push({
        locale: lang.locale,
        language,
        contents: keys.slice(i, i + batchSize),
      })
    }
  }

  callbacks.onProgress({ ...progress })

  if (tasks.length === 0) {
    callbacks.onLog(t.runNothing)
    return progress
  }

  callbacks.onLog(t.runTotalBatches(tasks.length, concurrency, intervalMs))

  await runTasks<TaskUnit, Record<string, string> | null>(
    {
      tasks,
      concurrency,
      intervalMs,
      worker: async (task, signal) => {
        const p = progress[task.locale]
        if (p.status === "pending") {
          p.status = "running"
          callbacks.onProgress({ ...progress })
        }
        callbacks.onLog(t.runBatchProcessing(task.language, task.contents.length))
        return translate(task.contents, task.language, selection, signal)
      },
      onResult: (map, task) => {
        const p = progress[task.locale]
        if (map && Object.keys(map).length > 0) {
          mergeTranslations(data, map, task.locale)
          p.done += Object.keys(map).length
        } else {
          p.failed += task.contents.length
          callbacks.onLog(t.runBatchFailed(task.language))
        }
        if (p.done + p.failed >= p.total) {
          p.status = p.failed > 0 ? "partial" : "completed"
        }
        callbacks.onProgress({ ...progress })
      },
      onError: (e, task) => {
        const p = progress[task.locale]
        p.failed += task.contents.length
        if (p.done + p.failed >= p.total) {
          p.status = "partial"
        }
        const msg = e instanceof Error ? e.message : String(e)
        callbacks.onLog(t.runBatchError(task.language, msg))
        callbacks.onProgress({ ...progress })
      },
    },
    controller,
  )

  return progress
}
