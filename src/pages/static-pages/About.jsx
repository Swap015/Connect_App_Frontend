

const About = () => {
    return (
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 px-6">
            <div className="max-w-5xl mx-auto text-center">

                {/* Heading */}

                <h1 className="text-2xl sm:text-4xl xl:text-5xl font-bold text-gray-800 mb-6">
                    About <span className="bg-gradient-to-r from-[#f6d365] to-[#fe6f48] bg-clip-text text-transparent">Connect</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                    <strong>Connect</strong> is not just another job portal — it’s a platform
                    that blends <span className="font-semibold text-gray-800">professional networking</span>
                    with <span className="font-semibold text-gray-800">career growth</span>.
                    Think of it as your space to showcase skills, build meaningful connections,
                    and explore opportunities like never before.
                </p>
            </div>

            {/* Mission  */}

            <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                    Our Mission 🚀
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                    To make <span className="font-semibold">career growth social and accessible</span>
                    for everyone — whether you’re a student, a professional, or a recruiter.
                    We believe in empowering people to learn, connect, and succeed.
                </p>
            </div>

            {/* Values  */}

            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                    Our Core Values 🌟
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-700">
                    <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">🔍 Transparency</h3>
                        <p className="text-gray-600 text-sm lg:text-md xl:text-lg">
                            Clear, honest, and fair networking and hiring for all members.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">🌍 Equal Opportunities</h3>
                        <p className="text-gray-600 text-sm lg:text-md xl:text-lg">
                            We ensure that opportunities reach everyone, everywhere.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-3">🤝 Community</h3>
                        <p className="text-gray-600 text-sm lg:text-md xl:text-lg">
                            Building a supportive, professional, and growth-driven ecosystem.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
