import React from 'react';
import Avatar from '../Avatar';
import { render, waitFor, configure } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import colors from '../../../enums/colors';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });
const testId = 'foundry-avatar';

describe('Avatar', () => {
  it('matches snapshot', async () => {
    const { container } = render(<Avatar color={colors.grayXlight} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
  it('matches snapshot loading state', async () => {
    const { container } = render(<Avatar isLoading color={colors.grayXlight} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar displays correct initials when there is no image', async () => {
    const { container } = render(<Avatar placeholder="SA" color={colors.grayXlight} />);

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar displays correct image when their is an image', async () => {
    const { container } = render(
      <Avatar imgURL="https://tinyurl.com/49dba3d4" color={colors.grayXlight} />,
    );
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar size is correct', async () => {
    const { container } = render(<Avatar size={21} color={colors.grayXlight} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar shape is correct', async () => {
    const { container } = render(<Avatar borderRadiusPercent={30} color={colors.grayXlight} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Avatar color={colors.grayXlight}></Avatar>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Ref Tests', () => {
    it('avatarText.current should exist', async () => {
      const ref = React.createRef<HTMLSpanElement>();
      const { getByTestId } = render(<Avatar textRef={ref} color={colors.grayXlight} />);
      await waitFor(() => {
        expect(ref.current instanceof HTMLSpanElement).toBeTruthy();
      });
    });
  });
});
