// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CredentialForm } from './CredentialForm';
import { adapterFields } from '../../lib/credentials/schema';

describe('CredentialForm', () => {
  const mockOnSaved = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders form fields for adapter', () => {
    render(
      <CredentialForm
        adapter="adguard"
        fields={adapterFields['adguard']}
        current={null}
        onSaved={mockOnSaved}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('adguard Credentials')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save credentials' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('shows help text for masked fields', () => {
    render(
      <CredentialForm
        adapter="adguard"
        fields={adapterFields['adguard']}
        current={{ url: 'http://test', user: 'admin', pass: 'secret' }}
        onSaved={mockOnSaved}
        onCancel={mockOnCancel}
      />
    );

    // Since there are multiple elements with the same text, we need to be more specific
    const helpTextElements = screen.getAllByText('Leave blank to keep current');
    expect(helpTextElements).toHaveLength(3); // One for each field
  });

  it('calls onSaved with filled values when submitted', async () => {
    render(
      <CredentialForm
        adapter="adguard"
        fields={adapterFields['adguard']}
        current={null}
        onSaved={mockOnSaved}
        onCancel={mockOnCancel}
      />
    );

    const urlInput = screen.getByLabelText('URL');
    const userInput = screen.getByLabelText('Username');
    const passInput = screen.getByLabelText('Password');
    const saveButton = screen.getByRole('button', { name: 'Save credentials' });

    fireEvent.change(urlInput, { target: { value: 'http://test' } });
    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'secret' } });
    fireEvent.click(saveButton);

    expect(mockOnSaved).toHaveBeenCalledWith({
      url: 'http://test',
      user: 'admin',
      pass: 'secret',
    });
  });


});