

const Privacy = () => {
    return (
        <section className="w-full bg-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
                    Privacy <span className="bg-gradient-to-r from-[#f6d365] to-[#fe6f48] bg-clip-text text-transparent">Policy</span>
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-6 xl:text-xl">
                    At <strong>Connect</strong>, your privacy matters. This Privacy Policy explains
                    how we collect, use, and safeguard your information when you use our platform.
                </p>

                <h2 className="lg:text-2xl text-xl font-bold text-gray-800 mt-8 mb-3">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4 text-lg lg:text-xl">Personal details, career history, and interactions on the platform.</p>

                <h2 className="lg:text-2xl text-xl  font-bold text-gray-800 mt-8 mb-3">2. How We Use Your Data</h2>
                <p className="text-gray-600 mb-4 text-lg lg:text-xl">To connect you with opportunities, improve networking, and personalize your experience.</p>

                <h2 className="lg:text-2xl text-xl  font-bold text-gray-800 mt-8 mb-3">3. Your Rights</h2>
                <p className="text-gray-600 mb-4 text-lg lg:text-xl">You can control what you share, update your data, or request account deletion anytime.</p>

                <p className="text-gray-600 mt-10 text-center italic text-sm ">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </section>
    );
};

export default Privacy;
