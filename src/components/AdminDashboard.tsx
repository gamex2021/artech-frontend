import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface Project {
    id: number;
    title: string;
    description: string;
    image_url: string;
    project_url: string;
}

const AdminDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState({ title: '', description: '', image_url: '', project_url: '' });
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
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

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/projects`, newProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(prevProjects => [response.data, ...prevProjects]);
            setNewProject({ title: '', description: '', image_url: '', project_url: '' });
            setTotalCount(prevCount => prevCount + 1);
        } catch (error) {
            setError('Failed to create project. Please try again.');
        }
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/projects/${editingProject.id}`, editingProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(prevProjects => prevProjects.map(p => p.id === editingProject.id ? response.data : p));
            setEditingProject(null);
        } catch (error) {
            setError('Failed to update project. Please try again.');
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
                fetchProjects()
            } catch (error) {
                setError('Failed to delete project. Please try again.');
            }
        }
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out transform hover:scale-105 focus:scale-105";

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
            </div>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Create New Project</h2>
                        </div>
                        <div className="border-t border-gray-200">
                            <form onSubmit={handleCreateProject} className="px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                        <motion.input
                                            whileHover={{ scale: 1.02 }}
                                            whileFocus={{ scale: 1.02 }}
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <motion.input
                                            whileHover={{ scale: 1.02 }}
                                            whileFocus={{ scale: 1.02 }}
                                            type="url"
                                            name="image_url"
                                            id="image_url"
                                            value={newProject.image_url}
                                            onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                        <motion.textarea
                                            whileHover={{ scale: 1.02 }}
                                            whileFocus={{ scale: 1.02 }}
                                            name="description"
                                            id="description"
                                            rows={3}
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                            className={inputClasses}
                                            required
                                        ></motion.textarea>
                                    </div>
                                    <div className="col-span-6 sm:col-span-4">
                                        <label htmlFor="project_url" className="block text-sm font-medium text-gray-700">Project URL</label>
                                        <motion.input
                                            whileHover={{ scale: 1.02 }}
                                            whileFocus={{ scale: 1.02 }}
                                            type="url"
                                            name="project_url"
                                            id="project_url"
                                            value={newProject.project_url}
                                            onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Create Project
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Existing Projects</h2>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <motion.li
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="px-4 py-4 sm:px-6"
                                    >
                                        {editingProject && editingProject.id === project.id ? (
                                            <form onSubmit={handleUpdateProject} className="space-y-4">
                                                <div>
                                                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title</label>
                                                    <motion.input
                                                        whileHover={{ scale: 1.02 }}
                                                        whileFocus={{ scale: 1.02 }}
                                                        type="text"
                                                        id="edit-title"
                                                        value={editingProject.title}
                                                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                                        className={inputClasses}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                                                    <motion.textarea
                                                        whileHover={{ scale: 1.02 }}
                                                        whileFocus={{ scale: 1.02 }}
                                                        id="edit-description"
                                                        rows={3}
                                                        value={editingProject.description}
                                                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                                        className={inputClasses}
                                                        required
                                                    ></motion.textarea>
                                                </div>
                                                <div>
                                                    <label htmlFor="edit-image-url" className="block text-sm font-medium text-gray-700">Image URL</label>
                                                    <motion.input
                                                        whileHover={{ scale: 1.02 }}
                                                        whileFocus={{ scale: 1.02 }}
                                                        type="url"
                                                        id="edit-image-url"
                                                        value={editingProject.image_url}
                                                        onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                                                        className={inputClasses}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="edit-project-url" className="block text-sm font-medium text-gray-700">Project URL</label>
                                                    <motion.input
                                                        whileHover={{ scale: 1.02 }}
                                                        whileFocus={{ scale: 1.02 }}
                                                        type="url"
                                                        id="edit-project-url"
                                                        value={editingProject.project_url}
                                                        onChange={(e) => setEditingProject({ ...editingProject, project_url: e.target.value })}
                                                        className={inputClasses}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        type="submit"
                                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Save
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        type="button"
                                                        onClick={() => setEditingProject(null)}
                                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setEditingProject(project)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Edit
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Delete
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                        {hasMore && (
                            <div className="px-4 py-5 sm:px-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setPage(page + 1)
                                    }}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Load More'}
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;