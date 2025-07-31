export default function HeroSection() {
    return (
        <div className="relative bg-black">
            <main className="lg:relative">
                <div className="mx-auto w-full max-w-7xl pb-20 pt-16 text-center lg:py-48 lg:text-left">
                    <div className="px-6 sm:px-8 lg:w-1/2 xl:pr-16">
                        <h1 className="text-4xl font-f1bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                            <span className="block xl:inline">Fanmade</span>{' '}
                            <span className="block text-red-600 xl:inline">F1 API Dashboard</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-md text-lg text-gray-300 sm:text-xl md:mt-6 md:max-w-3xl">
                            Powered by community-maintained <span className="text-white font-semibold">OpenF1</span> and <span className="text-white font-semibold">JoliApi</span>.
                            Explore real-time racing data, stats, and visuals — crafted with passion for Formula 1.
                        </p>
                        <p className="mt-6 text-sm text-gray-400">
                            Built by <span className="text-white font-bold">Mubashir Asif</span>
                        </p>
                        <div className="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 lg:justify-start">
                            {/* Visit GitHub Profile */}
                            <div className="rounded-md shadow">
                                <a
                                    href="https://github.com/Ihaxxxx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 md:px-10 md:py-4 md:text-lg"
                                >
                                    Visit GitHub
                                </a>
                            </div>

                            {/* View Code Button */}
                            <div className="rounded-md shadow">
                                <a
                                    href="https://github.com/Ihaxxxx/F1-API"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center rounded-md border border-white bg-black px-8 py-3 text-base font-medium text-white hover:border-red-600 hover:text-red-500 md:px-10 md:py-4 md:text-lg"
                                >
                                    View Code
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2 flex items-center justify-center bg-black">
                    <img
                        alt="F1 logo"
                        src="/images/F1-Logo.png"
                        className="h-48 w-auto object-contain"
                    />
                </div>

            </main>
        </div>
    );
}
