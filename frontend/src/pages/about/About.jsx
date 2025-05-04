import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-[#123458]">
      <h1 className="text-3xl font-semibold mb-6">About Campus Collab</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">What is Campus Collab?</h2>
        <p className="text-lg">
          Campus Collab is an exclusive platform for students of GGSIPU to connect with others who share similar interests and skills. Whether you’re working on a personal project, starting a new initiative, or looking for like-minded collaborators, Campus Collab is here to help you find people who are interested in joining forces and bringing your ideas to life.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ul className="list-disc list-inside text-lg">
          <li><strong>Post Your Projects:</strong> Share details about your personal projects and what kind of help or collaboration you're seeking.</li>
          <li><strong>Discover Opportunities:</strong> Browse through posts from other students and find projects that align with your skills or interests.</li>
          <li><strong>Connect with Collaborators:</strong> Reach out to students who are interested in your projects or who have the skills you need.</li>
          <li><strong>Grow Your Network:</strong> Build connections with GGSIPU students across different fields and departments, creating opportunities for future collaboration and learning.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg">
          Campus Collab aims to provide a platform where GGSIPU students can easily find potential collaborators for their personal projects. Whether it’s tech development, design, research, or anything else, this platform is designed to help students unite their strengths and create something meaningful together.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="text-lg">
          Our vision is to create a community of students who are proactive in working together, sharing ideas, and learning from one another. By collaborating on personal projects, students will not only gain experience but also contribute to a vibrant, supportive campus environment.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Why Campus Collab?</h2>
        <ul className="list-disc list-inside text-lg">
          <li><strong>For GGSIPU Students, By GGSIPU Students:</strong> The platform is made specifically for the GGSIPU community, ensuring that you’re connecting with students who are close to you in terms of location, goals, and educational background.</li>
          <li><strong>Find Collaborators Fast:</strong> No need to spend hours searching for teammates. With Campus Collab, you can post your projects and quickly find others who are interested in joining.</li>
          <li><strong>Build a Portfolio:</strong> By collaborating on real-world projects, you can gain valuable experience and build your portfolio, which will benefit you in your academic and professional journey.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
        <p className="text-lg">
          Whether you’re looking for a teammate for your coding project, a design collaborator for your startup idea, or someone to help with research, Campus Collab is the place to connect. Post your project, discover others, and let’s create something amazing together!
        </p>
      </section>
    </div>
  );
};

export default AboutPage;