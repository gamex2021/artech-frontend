import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// type interface
interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
}

// This component fetches and displays a list of projects
export default function ProjectList() {
  // State to store the list of projects
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch the project data when the component first renders
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Make a GET request to fetch projects from the server
        const response = await fetch(`${process.env.REACT_APP_API_URL}/projects`);

        // If the response is not OK, throw an error
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }


        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    // Call the function to fetch projects
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#090b1e] py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated heading for the section */}
      <motion.h2
        className="text-4xl font-bold mb-12 text-center text-white"
        initial={{ opacity: 0, y: -20 }} // Start with the heading faded and slightly off the top
        animate={{ opacity: 1, y: 0 }} // Fade in and move into place
        transition={{ duration: 0.5 }} // The animation lasts half a second
      >
        AI Projects
      </motion.h2>

      {/* Grid layout to display the projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="bg-[#1c1c2d] bg-opacity-80 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-105"
            initial={{ opacity: 0, y: 20 }} // Start hidden and slightly shifted down
            animate={{ opacity: 1, y: 0 }} // Fade in and shift into place
            transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger the animation for each project
          >
            {/* Project image */}
            <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />

            {/* Project details */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>

              {/* Button to view more details with a little bounce animation on hover */}
              <motion.a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#4d4d6b] text-white border border-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-[#2a2a38]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View More
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
