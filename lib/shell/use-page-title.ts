'use client';

import { useContext, useEffect } from 'react';
import { ShellContext } from '../../components/shell/Shell';

const usePageTitle = (title: string) => {
  const { setTitle } = useContext(ShellContext);
  
  useEffect(() => {
    setTitle(title);
    document.title = `${title} / Nyrvana`;
  }, [title, setTitle]);
};

export default usePageTitle;