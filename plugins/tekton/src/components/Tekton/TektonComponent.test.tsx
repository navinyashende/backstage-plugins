import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { useTheme } from '@material-ui/core/styles';
import { TektonComponent } from './TektonComponent';
import { useKubernetesObjects } from '@backstage/plugin-kubernetes';

// mock useEntity
jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => ({
    entity: {
      metadata: {
        name: 'test',
      },
    },
  }),
}));

jest.mock('@backstage/plugin-kubernetes', () => ({
  useKubernetesObjects: jest.fn(),
}));

// mocks useTheme
jest.mock('@material-ui/core/styles', () => {
  const originalModule = jest.requireActual('@material-ui/core/styles');
  return {
    ...originalModule,
    useTheme: jest.fn(),
  };
});

const useThemeMock = useTheme as jest.Mock;
const mockUseKubernetesObjects = useKubernetesObjects as jest.Mock;

describe('TektonComponent', () => {
  beforeEach(() => {
    mockUseKubernetesObjects.mockReturnValue({
      kubernetesObjects: { items: [] },
      loading: false,
      error: '',
    });
    useThemeMock.mockClear();
    mockUseKubernetesObjects.mockClear();
  });
  it('should render TektonComponent', async () => {
    useThemeMock.mockReturnValue({
      palette: {
        type: 'dark',
      },
    });
    const { getByText } = render(wrapInTestApp(<TektonComponent />));
    await waitFor(() => {
      expect(getByText(/pipeline visualization/i)).not.toBeNull();
    });
  });

  it('should show dark theme', async () => {
    useThemeMock.mockReturnValue({
      palette: {
        type: 'dark',
      },
    });
    render(wrapInTestApp(<TektonComponent />));
    const htmlTagElement = document.documentElement;
    await waitFor(() => {
      expect(htmlTagElement.classList.contains('pf-theme-dark')).toBe(true);
    });
  });

  it('should show light theme', async () => {
    useThemeMock.mockReturnValue({
      palette: {
        type: 'light',
      },
    });
    render(wrapInTestApp(<TektonComponent />));
    const htmlTagElement = document.documentElement;
    await waitFor(() => {
      expect(htmlTagElement.classList.contains('pf-theme-dark')).toBe(false);
    });
  });
});