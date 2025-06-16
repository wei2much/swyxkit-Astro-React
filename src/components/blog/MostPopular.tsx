export default function MostPopular() {
  return (
    <section className="flex flex-col gap-4 rounded-xl bg-slate-200 dark:bg-opacity-50 dark:bg-slate-700 p-4 w-full">
      <h3 className="mb-4 text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
        Most Popular
      </h3>

      <a
        className="w-full text-gray-900 hover:text-yellow-600 hover:no-underline dark:text-gray-100 dark:hover:text-yellow-100"
        href="./blog/welcome-to-swyxkit/"
      >
        <div className="w-full">
          <div className="flex flex-col justify-between md:flex-row">
            <h4 className="mb-2 w-full flex-auto text-lg font-bold md:text-xl">
              Welcome to SwyxKit!
            </h4>
          </div>
          <p className="ml-8 text-gray-600 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-100">
            This is the preferred starter for Astro + React projects!
          </p>
        </div>
      </a>

      <a
        className="w-full text-gray-900 hover:text-yellow-600 hover:no-underline dark:text-gray-100 dark:hover:text-yellow-100"
        href="./blog/moving-to-astro/"
      >
        <div className="w-full">
          <div className="flex flex-col justify-between md:flex-row">
            <h4 className="mb-2 w-full flex-auto text-lg font-bold md:text-xl">
              Moving to Astro + React
            </h4>
          </div>
          <p className="ml-8 text-gray-600 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-100">
            The migration story from SvelteKit to Astro!
          </p>
        </div>
      </a>
    </section>
  );
}
