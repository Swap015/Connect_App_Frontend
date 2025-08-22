
const Terms = () => {
    return (
        <section className="w-full bg-white  py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-4xl xl:text-5xl font-bold text-gray-800 mb-8 text-center">
                    Terms & <span className="bg-gradient-to-r from-[#f6d365] to-[#fe6f48] bg-clip-text text-transparent">Conditions</span>
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    By using <strong>Connect</strong>, you agree to follow these terms and conditions.
                    Please read them carefully before using the platform.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">1. User Responsibilities</h2>
                <p className="text-gray-600 mb-4 text-lg">You must provide accurate information and respect other users.</p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">2. Content Ownership</h2>
                <p className="text-gray-600 mb-4 text-lg">You own the content you share, but grant us permission to display it within the platform.</p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">3. Prohibited Activities</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 text-lg">
                    <li>Spamming or posting harmful content.</li>
                    <li>Harassing other members.</li>
                    <li>Misusing job postings or personal data.</li>
                </ul>

                <p className="text-gray-600 mt-10 text-center italic text-sm">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </section>
    );
};

export default Terms;
