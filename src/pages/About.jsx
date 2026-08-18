import React from 'react';

const About = () => {
    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About EstatePro</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your trusted partner in navigating the complex world of real estate.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Founded with a vision to revolutionize the property market, EstatePro has grown from a small local agency to a leading real estate platform. We believe that finding a home should be an exciting journey, not a stressful task.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Over the years, we have facilitated thousands of successful property transactions, building a reputation for transparency, integrity, and unparalleled customer service.
                        </p>
                    </div>
                    <div className="h-96 rounded-2xl overflow-hidden shadow-xl">
                        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80" alt="Our Office" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-primary-50 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4 text-primary-700">Our Mission</h3>
                        <p className="text-gray-700">To simplify the real estate process by providing cutting-edge technology, comprehensive market data, and expert human guidance to help people make the best property decisions.</p>
                    </div>
                    <div className="bg-primary-50 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4 text-primary-700">Our Vision</h3>
                        <p className="text-gray-700">To be the world's most trusted and user-centric real estate platform, creating seamless connections between buyers, sellers, and agents across the globe.</p>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-12 text-gray-900">Meet Our Leadership</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group">
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 shadow-lg">
                                    <img src={`https://i.pravatar.cc/300?img=${i+10}`} alt={`Team Member ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">John Doe {i}</h3>
                                <p className="text-primary-600 font-medium">Real Estate Expert</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
