import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchProjects = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
        params: { skip: (page - 1) * 10, limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const { projects: newProjects, total_count } = response.data;
      setProjects(prevProjects => {
        let arr = [...prevProjects, ...newProjects];

        // Filter out duplicates by creating a map using project ids
        const uniqueProjects = arr.reduce((acc, current) => {
          const existingProject = acc.find((item: any) => item.id === current.id);
          if (!existingProject) {
            acc.push(current); // Add the project only if it's not already in the accumulator
          }
          return acc;
        }, []);

        setHasMore(uniqueProjects.length < total_count);
        return uniqueProjects;
      });


    } catch (error) {
      setError('Failed to fetch projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  return (
    <div className="min-h-screen bg-[#090b1e] py-16 px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-4xl font-bold mb-12 text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI Projects
      </motion.h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="bg-[#1c1c2d] bg-opacity-80 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
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
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setPage(page + 1)
            }}
            className="bg-[#4d4d6b] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-[#2a2a38]"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}