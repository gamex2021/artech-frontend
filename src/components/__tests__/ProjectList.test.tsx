import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ProjectList from '../ProjectList';
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

describe('ProjectList', () => {
    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({ data: { projects: mockProjects, total_count: 2 } });
    });

    it('renders projects correctly', async () => {
        render(
            <AuthProvider>
                <ProjectList />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });
    });

    it('loads more projects when clicking "Load More"', async () => {
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({ data: { projects: [mockProjects[0]], total_count: 2 } })
            .mockResolvedValueOnce({ data: { projects: [mockProjects[1]], total_count: 2 } });

        render(
            <AuthProvider>
                <ProjectList />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });

        const loadMoreButton = screen.getByText('Load More');
        fireEvent.click(loadMoreButton);

        await waitFor(() => {
            expect(screen.getByText('Project 2')).toBeInTheDocument();
        });
    });

    it('handles errors when fetching projects', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(
            <AuthProvider>
                <ProjectList />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch projects. Please try again.')).toBeInTheDocument();
        });
    });
});