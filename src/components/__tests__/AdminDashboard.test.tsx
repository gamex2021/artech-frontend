import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AdminDashboard from '../AdminDashboard';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('axios');
jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: () => ({ token: 'mock-token' }),
}));

const mockProjects = [
    { id: 1, title: 'Project 1', description: 'Description 1', image_url: 'image1.jpg', project_url: 'url1' },
    { id: 2, title: 'Project 2', description: 'Description 2', image_url: 'image2.jpg', project_url: 'url2' },
];

describe('AdminDashboard', () => {
    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({ data: { projects: mockProjects, total_count: 2 } });
    });

    it('renders existing projects', async () => {
        render(
            <AuthProvider>
                <AdminDashboard />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });
    });

    it('creates a new project', async () => {
        const newProject = { title: 'New Project', description: 'New Description', image_url: 'new-image.jpg', project_url: 'new-url' };
        (axios.post as jest.Mock).mockResolvedValue({ data: { id: 3, ...newProject } });

        render(
            <AuthProvider>
                <AdminDashboard />
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: newProject.title } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: newProject.description } });
        fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: newProject.image_url } });
        fireEvent.change(screen.getByLabelText('Project URL'), { target: { value: newProject.project_url } });

        fireEvent.click(screen.getByText('Create Project'));

        await waitFor(() => {
            expect(screen.getByText(newProject.title)).toBeInTheDocument();
        });
    });

    it('updates an existing project', async () => {
        render(
            <AuthProvider>
                <AdminDashboard />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Edit')[0]);

        const updatedProject = { ...mockProjects[0], title: 'Updated Project 1' };
        (axios.put as jest.Mock).mockResolvedValue({ data: updatedProject });

        fireEvent.change(screen.getByDisplayValue('Project 1'), { target: { value: 'Updated Project 1' } });
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(screen.getByText('Updated Project 1')).toBeInTheDocument();
        });
    });

    it('deletes a project', async () => {
        window.confirm = jest.fn(() => true);
        (axios.delete as jest.Mock).mockResolvedValue({});

        render(
            <AuthProvider>
                <AdminDashboard />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => {
            expect(screen.queryByText('Project 1')).not.toBeInTheDocument();
        });
    });

    it('handles errors when fetching projects', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(
            <AuthProvider>
                <AdminDashboard />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch projects. Please try again.')).toBeInTheDocument();
        });
    });
});