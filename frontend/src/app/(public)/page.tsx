import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <Navbar />

            <section className="w-full bg-[radial-gradient(circle_at_top_left,_#fde2e4,_#fce7f3,_#fdf2f8)]">
                <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-20 min-h-screen">
                    {/* Left content */}
                    <div className="md:w-1/2 text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-purple-800">
                            Know where <br />
                            your money <br />
                            is going
                        </h1>

                        <p className="mt-6 text-gray-700 text-lg max-w-md">
                            Kinance is the best personal finance software to make managing your
                            money easier.
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/plans"
                                className="px-8 py-3 bg-purple-700 text-white font-semibold rounded-full shadow-md hover:bg-purple-800 transition inline-block"
                            >
                                See Plans & Pricing
                            </Link>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="relative md:w-1/2 mt-12 md:mt-0 flex justify-center">
                        {/* Donut Chart */}
                        <img
                            src="https://www.pocketsmith.com/assets/images/home/donut-lg.svg?_cchid=20ab86180a24b05566c83c5ccaaa84fb"
                            alt="Donut Chart"
                            className="w-full max-w-lg"
                        />

                        {/* Total in the middle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-3xl md:text-4xl font-bold text-purple-800">
                                $7,690.76
                            </p>
                            <p className="text-gray-600 font-medium text-sm">THIS MONTH</p>
                        </div>

                        {/* Coffee Image */}
                        <img
                            src="https://www.pocketsmith.com/assets/images/home/coffee.png?_cchid=813a92302654aa1fcc56ce503223e0cd"
                            alt="Coffee Illustration"
                            className="absolute bottom-0 right-1/4 w-32 md:w-44"
                        />

                        {/* Price bubble */}
                        <div className="absolute bottom-[12%] right-[18%] bg-white px-4 py-2 rounded-xl shadow-lg text-purple-800 font-semibold opacity-100 transform transition duration-500 ease-out">
                            <p className="text-sm">
                                ☕ Coffee <span className="text-gray-500">(3.42%)</span>
                            </p>
                            <p className="text-lg font-bold">($263.56)</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Heading chính */}
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                        All the features you need <br /> to manage your money
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Left content */}
                        <div className="md:w-1/2 text-left">
                            <p className="text-indigo-500 font-semibold mb-2">
                                Find the facts in your finances
                            </p>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Clear graphs and charts
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                It doesn’t matter if you’re motivated by your accountant, tax agent,
                                friend, foe or lover. Impress them all by wielding your new-found
                                clarity over your money.
                            </p>
                        </div>

                        {/* Right content */}
                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="https://www.pocketsmith.com/assets/images/home/all-features-finance-facts.png?_cchid=b82c3804b628a4c858824efea6f01174"
                                alt="Finance facts illustration"
                                className="max-w-md w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Left content */}
                    <div className="md:w-1/2 text-left">
                        <p className="text-green-600 font-semibold mb-2">
                            Get clarity and control
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Budgets and reporting
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Get control over your money, your way, with our flexible budgeting
                            system. Bring it all together with in-depth reports to see how you're
                            tracking.
                        </p>
                    </div>

                    {/* Right content */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="https://www.pocketsmith.com/assets/images/home/all-features-reminders.png?_cchid=31fe07d24de9e546b8c956a61454e7fd"
                            alt="Budgets and reporting illustration"
                            className="max-w-md w-full"
                        />
                    </div>
                </div>
            </section>

            <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-purple-700 text-white rounded-lg p-12 text-center shadow-lg">
                        {/* Logo icon */}
                        <div className="flex justify-center mb-6">
                            <img
                                src="/images/logo.png" // thay bằng logo bạn muốn
                                alt="Logo"
                                className="h-8 w-auto"
                            />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold mb-12">
                            Keeping your info secure is our top priority
                        </h2>

                        {/* Features grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🔒</span>
                                <p>Your data is encrypted at all times.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💻</span>
                                <p>We’re committed to active development.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💜</span>
                                <p>PocketSmith makes money from your subscription, not your data.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🛡️</span>
                                <p>Two-factor authentication available on all plans.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🙈</span>
                                <p>No ads or ad-tracking, ever.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">➡️</span>
                                <a
                                    href="#"
                                    className="underline hover:text-purple-200 transition"
                                >
                                    Learn about our security practices.
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-purple-700 py-20 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-yellow-100 mb-8">
                        It's time to take control of your finances
                    </h2>

                    {/* Button */}
                    <a
                        href="/plans"
                        className="inline-block px-8 py-4 bg-yellow-100 text-purple-700 font-semibold rounded-full shadow hover:bg-yellow-200 transition"
                    >
                        See Plans & Pricing
                    </a>
                </div>
            </section>

        <Footer></Footer>




        </div>
    );
}
