import React from 'react';
import Avatar from '../Avatar';
import { render, waitFor, configure } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });
const testId = 'foundry-avatar';

describe('Avatar', () => {
  it('matches snapshot', async() => {
    const { container } = render(<Avatar />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    })
  })
  it('matches snapshot Loading State', async () => {
    const { container } = render(<Avatar isLoading size={64} data-test-id={testId} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('matches snapshot Error State', async () => {
    const { container } = render(<Avatar isError size={64} data-testid={testId} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar displays correct initials when their is no image', async () => {
    const { container } = render(
      <Avatar initials="MI" hasImage={false} size={64} data-testid={testId} />,
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar displays correct image when their is an image', async () => {
    const { container } = render(
      <Avatar imgURL="https://tinyurl.com/49dba3d4"
       size={64} data-testid={testId} />,
    );
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('avatar size is correct', async () => {
    const { container } = render(
      <Avatar size={21} data-test-id={testId} />,
    );
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    })
  });

  it('avatar shape is correct', async () => {
    const { container } = render(
      <Avatar shape={30} data-test-id={testId} />,
    );
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    })
  });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Avatar></Avatar>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  }); 

  describe('Ref Tests', () => {
    it('avatarContainer.current should exist', async () => {
      // const ref = React.createRef<HTMLDivElement>();
      // const { getByTestId } = render(
      //   <Avatar avatarContainerRef={ref} avatarProps={{ 'data-test-id': testId }} />,
      // );
      // await waitFor(() => getByTestId(testId));
      // expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });

    it('avatarText.current should exist', async () => {

    });


    it('avatarImage.current should exist', async () => {

    });


    it('avatarLoading.current should exist', async () => {

    });
  });
});
