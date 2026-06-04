import { Navigation, Script } from "scripting"
import { TranslationApp } from "./components/TranslationApp"

async function run() {
  try {
    await Navigation.present({
      element: <TranslationApp />,
      modalPresentationStyle: "overFullScreen"
    })
  } finally {
    // Safety cleanup: ensure keep-alive and wake lock are released even if
    // the page is dismissed mid-run.
    try {
      Device.setWakeLockEnabled(false)
    } catch (e) {
      console.error(e)
    }
    try {
      await BackgroundKeeper.stopKeepAlive()
    } catch (e) {
      console.error(e)
    }
    Script.exit()
  }
}

run()
