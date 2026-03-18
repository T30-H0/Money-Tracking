export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure language, theme, and authentication behavior here later.
        </p>
      </div>

      <section className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-800">Language</h2>
        <p className="text-xs text-gray-500">
          Current language is controlled from the top bar. Wire this section to
          your i18n solution next.
        </p>
      </section>

      <section className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-800">Theme</h2>
        <p className="text-xs text-gray-500">
          Theme selection is also available in the top bar. Connect this to your
          theme provider when ready.
        </p>
      </section>
    </div>
  );
}

